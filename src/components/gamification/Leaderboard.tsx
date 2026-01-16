import clientPromise from '@/lib/mongodb';
import { Trophy, Medal, Crown } from 'lucide-react';

// Force dynamic rendering to ensure leaderboard is up-to-date
export const dynamic = 'force-dynamic';

interface LeaderboardUser {
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
        <div className="bg-[#3E2723] rounded-xl shadow-xl overflow-hidden border border-[#5D4037]">
            <div className="p-4 bg-[#2E7D32]/20 border-b border-[#5D4037] flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#ededed] flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#FFD600]" />
                    Leaderboard
                </h3>
                <span className="text-xs text-[#C6FF00] font-mono">Top Cultivators</span>
            </div>

            <div className="divide-y divide-[#5D4037]/50">
                {topUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-[#2E7D32]/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-8 flex justify-center">
                                {getRankIcon(index)}
                            </div>
                            <div>
                                <p className="font-bold text-[#ededed]">{user.name}</p>
                                <p className="text-xs text-[#C6FF00]">Level {user.gamification.level}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-mono text-[#FFD600] font-bold">{user.gamification.xp}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">XP</p>
                        </div>
                    </div>
                ))}

                {topUsers.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                        No cultivators found yet. Be the first!
                    </div>
                )}
            </div>
        </div>
    );
}
