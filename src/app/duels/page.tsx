'use client';

import { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Swords, Users, Trophy } from 'lucide-react';

type Question = {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
};

type MatchResult = {
    winnerId: string | null;
    accuracy: Record<string, number>;
    winBonusXp: number;
    pot: number;
    bids: Record<string, number>;
    answers: Record<string, Record<string, string | null>>;
};

export default function DuelsPage() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [queueStatus, setQueueStatus] = useState<'idle' | 'queued' | 'matched'>('idle');
    const [duelPhase, setDuelPhase] = useState<'bidding' | 'in_progress' | 'completed'>('bidding');
    const [roomId, setRoomId] = useState<string | null>(null);
    const [players, setPlayers] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [userXp, setUserXp] = useState(0);
    const [bidValue, setBidValue] = useState(25);
    const [bidError, setBidError] = useState('');
    const [bids, setBids] = useState<Record<string, number>>({});
    const [pot, setPot] = useState(0);
    const [ghostProgress, setGhostProgress] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [answerLog, setAnswerLog] = useState<Record<string, string | null>>({});

    useEffect(() => {
        const loadUser = async () => {
            const response = await fetch('/api/user/me');
            if (response.ok) {
                const data = await response.json();
                setUserId(String(data.id));
                setUserXp(Number(data?.gamification?.xp || 0));
            }
        };

        loadUser();
    }, []);

    useEffect(() => {
        let socketInstance: Socket | null = null;

        const connect = async () => {
            await fetch('/api/socket');
            socketInstance = io({
                path: '/api/socket',
            });

            socketInstance.on('match_found', async (payload: { roomId: string; players: string[] }) => {
                setQueueStatus('matched');
                setRoomId(payload.roomId);
                setPlayers(payload.players);
                setDuelPhase('bidding');
                setBids({});
                setPot(0);
                setBidError('');
                setMatchResult(null);
                setQuestions([]);
                setCurrentIndex(0);
                setAnsweredCount(0);
                setAnswerLog({});
                setSelectedOption(null);
                setScore(0);
                setGhostProgress(0);
            });

            socketInstance.on('bid_update', (payload: { bids: Record<string, number> }) => {
                setBids(payload.bids || {});
            });

            socketInstance.on('bids_locked', (payload: { bids: Record<string, number>; pot: number }) => {
                setBids(payload.bids || {});
                setPot(payload.pot || 0);
            });

            socketInstance.on('bid_error', (payload: { message: string }) => {
                setBidError(payload.message || 'Failed to submit bid.');
            });

            socketInstance.on('start_quiz', async (payload: { roomId: string; players: string[] }) => {
                setQueueStatus('matched');
                setRoomId(payload.roomId);
                setPlayers(payload.players);
                setGhostProgress(0);
                setCurrentIndex(0);
                setAnsweredCount(0);
                setScore(0);
                setMatchResult(null);
                setDuelPhase('in_progress');
                setAnswerLog({});
                setSelectedOption(null);
                setBidError('');

                const response = await fetch('/api/quiz/questions?limit=5&subject=Computer%20Science');
                const data: { questions?: Array<{ _id: string; text: string; options: string[]; correctAnswer: string }> } = await response.json();
                const formatted = (data.questions || []).map((q) => ({
                    id: q._id,
                    text: q.text,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                }));
                setQuestions(formatted);
            });

            socketInstance.on('ghost_progress', (payload: { progress: number }) => {
                setGhostProgress(Math.max(0, Math.min(1, payload.progress)));
            });

            socketInstance.on('match_result', (payload: MatchResult) => {
                setMatchResult(payload);
                setDuelPhase('completed');
            });

            setSocket(socketInstance);
        };

        connect();

        return () => {
            socketInstance?.disconnect();
        };
    }, []);

    const currentQuestion = questions[currentIndex];
    const progress = useMemo(() => {
        if (questions.length === 0) return 0;
        return Math.min(1, answeredCount / questions.length);
    }, [answeredCount, questions.length]);

    const opponentId = useMemo(() => {
        if (!userId) return null;
        return players.find((id) => id !== userId) || null;
    }, [players, userId]);

    const opponentAnswers = matchResult && opponentId ? matchResult.answers?.[opponentId] || {} : {};

    const handleJoinQueue = () => {
        socket?.emit('join_queue');
        setQueueStatus('queued');
    };

    const handleCancelQueue = () => {
        socket?.emit('cancel_queue');
        setQueueStatus('idle');
    };

    const handleSubmitBid = () => {
        if (!roomId) return;
        setBidError('');
        socket?.emit('submit_bid', { roomId, bid: bidValue });
    };

    const handleAnswer = (option: string) => {
        if (!currentQuestion || selectedOption) return;

        setSelectedOption(option);
        const isCorrect = option === currentQuestion.correctAnswer;
        const nextScore = isCorrect ? score + 1 : score;
        if (isCorrect) setScore((prev) => prev + 1);

        setAnswerLog((prev) => ({
            ...prev,
            [currentQuestion.id]: option,
        }));

        const nextIndex = currentIndex + 1;
        const nextAnswered = Math.min(questions.length, currentIndex + 1);
        setAnsweredCount(nextAnswered);
        const nextProgress = Math.min(1, nextAnswered / questions.length);
        if (roomId) {
            socket?.emit('answer', {
                roomId,
                progress: nextProgress,
                questionId: currentQuestion.id,
                selectedOption: option,
            });
        }

        setTimeout(() => {
            if (nextIndex >= questions.length) {
                const accuracy = questions.length > 0 ? nextScore / questions.length : 0;
                if (roomId) {
                    socket?.emit('finish', { roomId, accuracy });
                }
            } else {
                setCurrentIndex(nextIndex);
                setSelectedOption(null);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-earth text-[#ededed] p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Swords className="w-8 h-8 text-sun" />
                    <div>
                        <h1 className="text-2xl font-bold text-growth">Live Duels</h1>
                        <p className="text-sm text-gray-400">Match against another explorer and race to win.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {queueStatus === 'idle' && (
                        <button
                            onClick={handleJoinQueue}
                            className="px-4 py-2 bg-forest hover:bg-[#1B5E20] rounded-full font-semibold"
                        >
                            Join Matchmaking
                        </button>
                    )}
                    {queueStatus === 'queued' && (
                        <button
                            onClick={handleCancelQueue}
                            className="px-4 py-2 bg-[#5D4037] hover:bg-[#4E342E] rounded-full font-semibold"
                        >
                            Cancel Queue
                        </button>
                    )}
                    {queueStatus === 'queued' && (
                        <span className="text-xs text-sun">Searching for opponent...</span>
                    )}
                </div>
            </div>

            {queueStatus === 'matched' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#5D4037]/40 p-6 rounded-xl border border-[#5D4037]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-growth">
                                    <Users className="w-5 h-5" />
                                    <span className="font-semibold">XP Bid</span>
                                </div>
                                <span className="text-xs text-gray-400">Your XP: {userXp}</span>
                            </div>
                            {duelPhase === 'bidding' ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            min={1}
                                            max={userXp}
                                            value={bidValue}
                                            onChange={(event) => setBidValue(Math.max(1, Number(event.target.value) || 1))}
                                            className="w-32 bg-[#1B1B1B] border border-[#5D4037] rounded-lg px-3 py-2 text-sm"
                                        />
                                        <button
                                            onClick={handleSubmitBid}
                                            className="px-4 py-2 bg-sun text-[#1B1B1B] rounded-full font-semibold"
                                        >
                                            Lock Bid
                                        </button>
                                        <span className="text-xs text-gray-400">
                                            {bids[userId || ''] ? 'Waiting for opponent...' : 'Submit your bid to start.'}
                                        </span>
                                    </div>
                                    {bidError && <p className="text-xs text-red-300">{bidError}</p>}
                                    <div className="text-xs text-gray-400">
                                        Your bid: {bids[userId || ''] || '—'} | Opponent bid: {opponentId ? bids[opponentId] || '—' : '—'} | Pot: {pot || 0}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-400">
                                    Bids locked. Pot: {pot}. Duel in progress.
                                </div>
                            )}
                        </div>
                        <div className="bg-[#5D4037]/40 p-6 rounded-xl border border-[#5D4037]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-growth">
                                    <Users className="w-5 h-5" />
                                    <span className="font-semibold">Duel Progress</span>
                                </div>
                                <span className="text-xs text-gray-400">Room: {roomId?.slice(-6)}</span>
                            </div>
                            <p className="text-xs text-gray-400 mb-4">Players matched: {players.length} / 2</p>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-400 mb-2">You</p>
                                    <div className="h-2 bg-[#1B1B1B] rounded-full overflow-hidden">
                                        <div className="h-full bg-growth" style={{ width: `${progress * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-2">Opponent Ghost</p>
                                    <div className="h-2 bg-[#1B1B1B] rounded-full overflow-hidden">
                                        <div className="h-full bg-sun" style={{ width: `${ghostProgress * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {currentQuestion && !matchResult && duelPhase === 'in_progress' && (
                            <div className="bg-earth/80 p-6 rounded-xl border border-[#5D4037]">
                                <p className="text-sm text-gray-400 mb-2">Question {currentIndex + 1} / {questions.length}</p>
                                <h2 className="text-xl font-semibold mb-4">{currentQuestion.text}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {currentQuestion.options.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => handleAnswer(option)}
                                            className={`p-3 rounded-lg border transition-colors ${
                                                selectedOption === option
                                                    ? option === currentQuestion.correctAnswer
                                                        ? 'bg-forest border-growth'
                                                        : 'bg-red-900/70 border-red-500'
                                                    : 'bg-[#1B1B1B] border-[#5D4037] hover:border-sun'
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#5D4037]/40 p-6 rounded-xl border border-[#5D4037]">
                            <div className="flex items-center gap-2 text-sun mb-4">
                                <Trophy className="w-5 h-5" />
                                <span className="font-semibold">Duel Result</span>
                            </div>
                            {matchResult ? (
                                <div className="space-y-2 text-sm">
                                    <p>
                                        Winner:{' '}
                                        {matchResult.winnerId
                                            ? matchResult.winnerId === userId
                                                ? 'You'
                                                : 'Opponent'
                                            : 'Tie'}
                                    </p>
                                    <p>Pot: {matchResult.pot}</p>
                                    <p>Bonus XP: {matchResult.winBonusXp}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">Finish the duel to see results.</p>
                            )}
                        </div>

                        {matchResult && questions.length > 0 && (
                            <div className="bg-[#5D4037]/40 p-6 rounded-xl border border-[#5D4037]">
                                <p className="text-sm text-growth font-semibold mb-4">Duel Progress Review</p>
                                <div className="space-y-3 text-xs">
                                    {questions.map((question, index) => (
                                        <div key={question.id} className="p-3 bg-earth/70 rounded-lg border border-[#5D4037]">
                                            <p className="text-gray-300 mb-1">Q{index + 1}: {question.text}</p>
                                            <p className="text-gray-400">Correct: {question.correctAnswer}</p>
                                            <p className="text-gray-400">You: {answerLog[question.id] ?? 'No answer'}</p>
                                            <p className="text-gray-400">Opponent: {opponentAnswers?.[question.id] ?? 'No answer'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
