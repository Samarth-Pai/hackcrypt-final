import type { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import clientPromise from '@/lib/mongodb';
import { verifyJWT } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export const config = {
    api: {
        bodyParser: false,
    },
};

type MatchState = {
    roomId: string;
    players: string[];
    progress: Record<string, number>;
    accuracy: Record<string, number>;
    finished: Set<string>;
};

type QueueEntry = {
    userId: string;
    socketId: string;
};

const getStore = () => {
    const globalStore = globalThis as typeof globalThis & {
        io?: SocketIOServer;
        matchmakingQueue?: QueueEntry[];
        matches?: Map<string, MatchState>;
    };

    if (!globalStore.matchmakingQueue) globalStore.matchmakingQueue = [];
    if (!globalStore.matches) globalStore.matches = new Map();

    return globalStore;
};

const parseCookies = (cookieHeader?: string) => {
    const cookies: Record<string, string> = {};
    if (!cookieHeader) return cookies;

    cookieHeader.split(';').forEach((cookie) => {
        const [key, ...rest] = cookie.trim().split('=');
        cookies[key] = decodeURIComponent(rest.join('='));
    });

    return cookies;
};

const startMatch = (io: SocketIOServer, playerA: QueueEntry, playerB: QueueEntry) => {
    const roomId = `duel_${playerA.userId}_${playerB.userId}_${Date.now()}`;
    const match: MatchState = {
        roomId,
        players: [playerA.userId, playerB.userId],
        progress: {},
        accuracy: {},
        finished: new Set(),
    };

    const store = getStore();
    store.matches?.set(roomId, match);

    io.sockets.sockets.get(playerA.socketId)?.join(roomId);
    io.sockets.sockets.get(playerB.socketId)?.join(roomId);

    io.to(roomId).emit('start_quiz', {
        roomId,
        players: match.players,
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const store = getStore();

    if (!store.io) {
        const socket = res.socket as unknown as { server?: import('http').Server & { io?: SocketIOServer } };
        if (!socket?.server) {
            res.status(500).end();
            return;
        }

        const io = new SocketIOServer(socket.server, {
            path: '/api/socket',
            addTrailingSlash: false,
        });

        io.use(async (socket, next) => {
            const cookies = parseCookies(socket.request.headers.cookie as string | undefined);
            const token = cookies.session;
            if (!token) return next(new Error('Unauthorized'));

            const payload = await verifyJWT(token);
            if (!payload?.userId) return next(new Error('Unauthorized'));

            socket.data.userId = String(payload.userId);
            return next();
        });

        io.on('connection', (socket) => {
            const userId = socket.data.userId as string;

            socket.on('join_queue', () => {
                const queue = store.matchmakingQueue || [];
                const alreadyQueued = queue.some((entry) => entry.userId === userId);
                if (!alreadyQueued) {
                    queue.push({ userId, socketId: socket.id });
                }

                if (queue.length >= 2) {
                    const playerA = queue.shift()!;
                    const playerB = queue.shift()!;
                    startMatch(io, playerA, playerB);
                }

                store.matchmakingQueue = queue;
            });

            socket.on('cancel_queue', () => {
                store.matchmakingQueue = (store.matchmakingQueue || []).filter(
                    (entry) => entry.userId !== userId
                );
            });

            socket.on('answer', ({ roomId, progress }: { roomId: string; progress: number }) => {
                const match = store.matches?.get(roomId);
                if (!match || !match.players.includes(userId)) return;

                match.progress[userId] = Math.max(0, Math.min(1, progress));

                const opponentId = match.players.find((id) => id !== userId);
                if (opponentId) {
                    socket.to(roomId).emit('ghost_progress', {
                        userId,
                        progress: match.progress[userId],
                    });
                }
            });

            socket.on('finish', async ({ roomId, accuracy }: { roomId: string; accuracy: number }) => {
                const match = store.matches?.get(roomId);
                if (!match || !match.players.includes(userId)) return;

                match.accuracy[userId] = Math.max(0, Math.min(1, accuracy));
                match.finished.add(userId);

                if (match.finished.size === match.players.length) {
                    const [playerA, playerB] = match.players;
                    const accA = match.accuracy[playerA] ?? 0;
                    const accB = match.accuracy[playerB] ?? 0;

                    let winnerId: string | null = null;
                    if (accA > accB) winnerId = playerA;
                    if (accB > accA) winnerId = playerB;

                    if (winnerId) {
                        const client = await clientPromise;
                        const db = client.db();
                        await db.collection('users').updateOne(
                            { _id: new ObjectId(winnerId) },
                            {
                                $inc: {
                                    'gamification.winStreak': 1,
                                    'gamification.xp': 50,
                                },
                            }
                        );
                    }

                    io.to(roomId).emit('match_result', {
                        winnerId,
                        accuracy: match.accuracy,
                        winBonusXp: 50,
                    });

                    store.matches?.delete(roomId);
                }
            });

            socket.on('disconnect', () => {
                store.matchmakingQueue = (store.matchmakingQueue || []).filter(
                    (entry) => entry.userId !== userId
                );
            });
        });

        store.io = io;
    }

    res.end();
}
