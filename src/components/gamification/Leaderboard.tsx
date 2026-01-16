import clientPromise from '@/lib/mongodb';
import { Trophy, Medal, Crown } from 'lucide-react';
import Link from 'next/link';
import CosmicCard from '@/components/cosmic/CosmicCard';

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
            case 0: return <Crown className="w-6 h-6 text-yellow-400" />;
            case 1: return <Medal className="w-6 h-6 text-slate-300" />;
            case 2: return <Medal className="w-6 h-6 text-amber-600" />;
            default: return <span className="font-bold text-slate-500">#{index + 1}</span>;
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
                                className="block"
                            >
                                <CosmicCard
                                    glow={index === 0 ? 'cyan' : 'none'}
                                    className={`
                                        flex items-center justify-between p-4 
                                        hover:border-violet-500/50 transition-all group relative overflow-hidden
                                        ${index === 0 ? 'bg-cyan-950/20' : ''}
                                    `}
                                >
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        {index === 0 && <Crown className="text-yellow-400" size={40} />}
                                    </div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="w-8 flex justify-center">
                                            {getRankIcon(index)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-100 tracking-tight">{user.name}</p>
                                            <div className="flex items-center gap-1.5 font-mono text-violet-400">
                                                <div className="w-1 h-1 rounded-full bg-violet-400" />
                                                <p className="text-[10px] uppercase font-bold tracking-widest">LVL_{user.gamification.level}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right relative z-10">
                                        <p className="font-mono font-black text-lg text-glow" style={{ color: index === 0 ? '#FACC15' : '#A855F7' }}>{user.gamification.xp}</p>
                                        <p className="text-[8px] text-slate-500 uppercase tracking-[0.3em] font-black">Points_Sync</p>
                                    </div>
                                </CosmicCard>
                            </Link>
                        );
                    })()
                ))}

                {topUsers.length === 0 && (
                    <div className="p-12 text-center rounded-3xl border border-dashed border-slate-800">
                        <Trophy className="mx-auto text-slate-700 mb-4" size={40} />
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-black leading-relaxed">
                            No Neural Data Found.<br />Establish Synchronicity.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
