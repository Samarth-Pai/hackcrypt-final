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
    bids: Record<string, number>;
    pot: number;
    stakesLocked: boolean;
    answers: Record<string, Record<string, string | null>>;
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
        bids: {},
        pot: 0,
        stakesLocked: false,
        answers: {},
    };

    const store = getStore();
    store.matches?.set(roomId, match);

    io.sockets.sockets.get(playerA.socketId)?.join(roomId);
    io.sockets.sockets.get(playerB.socketId)?.join(roomId);

    io.to(roomId).emit('match_found', {
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

            socket.on('submit_bid', async ({ roomId, bid }: { roomId: string; bid: number }) => {
                const match = store.matches?.get(roomId);
                if (!match || !match.players.includes(userId)) return;
                if (match.stakesLocked) return;

                const sanitizedBid = Math.max(0, Math.floor(Number(bid)));
                if (!sanitizedBid) {
                    socket.emit('bid_error', { message: 'Bid must be at least 1 XP.' });
                    return;
                }

                const client = await clientPromise;
                const db = client.db();
                const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
                const xp = Number(user?.gamification?.xp || 0);

                if (xp < sanitizedBid) {
                    socket.emit('bid_error', { message: 'Insufficient XP for this bid.' });
                    return;
                }

                match.bids[userId] = sanitizedBid;
                io.to(roomId).emit('bid_update', { bids: match.bids });

                if (match.players.every((id) => match.bids[id] && match.bids[id] > 0)) {
                    const [playerA, playerB] = match.players;
                    const bidA = match.bids[playerA];
                    const bidB = match.bids[playerB];

                    if (!bidA || !bidB) return;

                    await db.collection('users').updateOne(
                        { _id: new ObjectId(playerA), 'gamification.xp': { $gte: bidA } },
                        { $inc: { 'gamification.xp': -bidA } }
                    );
                    await db.collection('users').updateOne(
                        { _id: new ObjectId(playerB), 'gamification.xp': { $gte: bidB } },
                        { $inc: { 'gamification.xp': -bidB } }
                    );

                    match.stakesLocked = true;
                    match.pot = bidA + bidB;

                    io.to(roomId).emit('bids_locked', { bids: match.bids, pot: match.pot });
                    io.to(roomId).emit('start_quiz', { roomId, players: match.players });
                }
            });

            socket.on('answer', ({ roomId, progress, questionId, selectedOption }: { roomId: string; progress: number; questionId: string; selectedOption: string | null }) => {
                const match = store.matches?.get(roomId);
                if (!match || !match.players.includes(userId)) return;

                match.progress[userId] = Math.max(0, Math.min(1, progress));
                if (!match.answers[userId]) match.answers[userId] = {};
                if (questionId) {
                    match.answers[userId][questionId] = selectedOption ?? null;
                }

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

                    const client = await clientPromise;
                    const db = client.db();

                    if (winnerId) {
                        await db.collection('users').updateOne(
                            { _id: new ObjectId(winnerId) },
                            {
                                $inc: {
                                    'gamification.winStreak': 1,
                                    'gamification.xp': match.pot + 50,
                                },
                            }
                        );
                    } else if (match.stakesLocked) {
                        await db.collection('users').updateOne(
                            { _id: new ObjectId(playerA) },
                            { $inc: { 'gamification.xp': match.bids[playerA] || 0 } }
                        );
                        await db.collection('users').updateOne(
                            { _id: new ObjectId(playerB) },
                            { $inc: { 'gamification.xp': match.bids[playerB] || 0 } }
                        );
                    }

                    io.to(roomId).emit('match_result', {
                        winnerId,
                        accuracy: match.accuracy,
                        winBonusXp: 50,
                        pot: match.pot,
                        bids: match.bids,
                        answers: match.answers,
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
