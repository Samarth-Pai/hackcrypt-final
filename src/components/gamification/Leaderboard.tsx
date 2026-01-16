import clientPromise from '@/lib/mongodb';
import { Trophy, Medal, Crown } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering to ensure leaderboard is up-to-date
export const dynamic = 'force-dynamic';

interface LeaderboardUser {
    _id: string | { toString: () => string };
    name: string;
    gamification: {
        level: number;
        xp: number;
    };
}

export default async function Leaderboard() {
    let topUsers: LeaderboardUser[] = [];

    try {
        const client = await clientPromise;
        const db = client.db();

        topUsers = await db.collection<LeaderboardUser>('users').aggregate([
            { $sort: { 'gamification.xp': -1 } },
            { $limit: 10 },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    'gamification.level': 1,
                    'gamification.xp': 1,
                },
            },
        ]).toArray() as unknown as LeaderboardUser[];
    } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        // Fallback or empty state
    }

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Crown className="w-6 h-6 text-[#FFD600]" />;
            case 1: return <Medal className="w-6 h-6 text-gray-300" />;
            case 2: return <Medal className="w-6 h-6 text-amber-600" />;
            default: return <span className="font-bold text-gray-400">#{index + 1}</span>;
        }
    };

    return (
        <div className="overflow-hidden">
            <div className="space-y-3">
                {topUsers.map((user, index) => (
                    (() => {
                        const userId = typeof user._id === 'string' ? user._id : user._id.toString();
                        return (
                    <Link
                        key={userId}
                        href={`/profile/${userId}`}
                        className="flex items-center justify-between p-4 glass-v2 border border-white/5 rounded-2xl hover:border-purple-ai/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-2 opacity-5">
                            {index === 0 && <Crown className="text-sun" size={40} />}
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-8 flex justify-center">
                                {getRankIcon(index)}
                            </div>
                            <div>
                                <p className="font-bold text-white tracking-tight">{user.name}</p>
                                <div className="flex items-center gap-1.5 font-mono text-purple-ai">
                                    <div className="w-1 h-1 rounded-full bg-purple-ai/40" />
                                    <p className="text-[10px] uppercase font-bold tracking-widest">LVL_{user.gamification.level}</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right relative z-10">
                            <p className="font-mono text-white font-black text-lg neon-text-ai" style={{ color: index === 0 ? '#FACC15' : '#A855F7' }}>{user.gamification.xp}</p>
                            <p className="text-[8px] text-gray-500 uppercase tracking-[0.3em] font-black">Points_Sync</p>
                        </div>
                    </Link>
                        );
                    })()
                ))}

                {topUsers.length === 0 && (
                    <div className="p-12 text-center rounded-3xl border border-dashed border-white/10">
                        <Trophy className="mx-auto text-gray-700 mb-4" size={40} />
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-black leading-relaxed">
                            No Neural Data Found.<br />Establish Synchronicity.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
