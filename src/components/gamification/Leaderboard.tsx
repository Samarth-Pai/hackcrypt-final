import clientPromise from '@/lib/mongodb';
import { Trophy, Medal, Crown } from 'lucide-react';
import Link from 'next/link';
import CosmicCard from '@/components/cosmic/CosmicCard';

// Force dynamic rendering to ensure leaderboard is up-to-date
export const dynamic = 'force-dynamic';

interface LeaderboardUser {
    _id: string | { toString: () => string };
    name: string;
    title?: string;
    avatarConfig?: {
        type?: 'custom' | 'classic';
        hero?: string;
        colors?: {
            primary: string;
            secondary: string;
            accent: string;
            bg: string;
        };
        imageUrl?: string;
    };
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
                    title: 1,
                    avatarConfig: 1,
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

    const getTier = (level: number) => {
        if (level >= 20) return 'Mythic';
        if (level >= 12) return 'Elite';
        if (level >= 6) return 'Veteran';
        return 'Rookie';
    };

    const getLevelProgress = (level: number, xp: number) => {
        const currentLevelStartXP = Math.pow(level - 1, 2) * 100;
        const nextLevelStartXP = Math.pow(level, 2) * 100;
        const xpForNextLevel = nextLevelStartXP - currentLevelStartXP;
        const currentLevelProgress = xp - currentLevelStartXP;
        const progressPercent = xpForNextLevel > 0
            ? Math.max(0, Math.min(100, (currentLevelProgress / xpForNextLevel) * 100))
            : 0;
        const xpToNext = Math.max(0, nextLevelStartXP - xp);
        return { progressPercent, xpToNext };
    };

    return (
        <div className="overflow-hidden">
            <div className="space-y-4">
                {topUsers.map((user, index) => (
                    (() => {
                        const userId = typeof user._id === 'string' ? user._id : user._id.toString();
                        const { progressPercent, xpToNext } = getLevelProgress(user.gamification.level, user.gamification.xp);
                        const tier = getTier(user.gamification.level);
                        const initials = user.name
                            ?.split(' ')
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join('')
                            .toUpperCase() || 'NX';
                        return (
                            <Link
                                key={userId}
                                href={`/profile/${userId}`}
                                className="block"
                            >
                                <CosmicCard
                                    glow={index === 0 ? 'cyan' : 'none'}
                                    className={`
                                        flex flex-col gap-4 p-4 md:p-5
                                        hover:border-violet-500/50 transition-all group relative overflow-hidden
                                        ${index === 0 ? 'bg-cyan-950/20' : ''}
                                    `}
                                >
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        {index === 0 && <Crown className="text-yellow-400" size={40} />}
                                    </div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="w-10 flex justify-center">
                                            {getRankIcon(index)}
                                        </div>
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-cyan-500/30 bg-black/40 flex items-center justify-center text-sm font-black text-cyan-200">
                                                {user.avatarConfig?.imageUrl ? (
                                                    <img
                                                        src={user.avatarConfig.imageUrl}
                                                        alt={user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span>{initials}</span>
                                                )}
                                            </div>
                                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest font-black text-cyan-300/80 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/20">
                                                {tier}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-100 tracking-tight text-lg">{user.name}</p>
                                            <p className="text-xs text-slate-400 truncate max-w-[220px]">
                                                {user.title || 'Cosmic Challenger'}
                                            </p>
                                            <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-violet-300">
                                                <span>LVL_{user.gamification.level}</span>
                                                <span className="text-slate-600">•</span>
                                                <span>Rank {index + 1}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono font-black text-xl text-glow" style={{ color: index === 0 ? '#FACC15' : '#A855F7' }}>{user.gamification.xp}</p>
                                            <p className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-black">Total_XP</p>
                                        </div>
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">
                                            <span>Next Level</span>
                                            <span>{xpToNext} XP</span>
                                        </div>
                                        <div className="mt-2 h-2 bg-[#0F061A] rounded-full overflow-hidden border border-cyan-500/20">
                                            <div className="h-full bg-cyan-400" style={{ width: `${progressPercent}%` }} />
                                        </div>
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
