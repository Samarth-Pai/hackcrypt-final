import { Suspense } from 'react';
import Leaderboard from '@/components/gamification/Leaderboard';
import { getUserProfile } from '@/lib/user';
import MissionControl from '@/components/dashboard/MissionControl';
import BadgeUnlock from '@/components/gamification/BadgeUnlock';

export default async function DashboardPage() {
    const user = await getUserProfile();
    const streakDays = user?.gamification?.streak?.count || 0;

    return (
        <div className="relative min-h-screen">
            {/* Achievement Layer */}
            {streakDays > 0 && (
                <BadgeUnlock
                    badgeName="First Sprint"
                    description="You've completed your first day of quests! Keep the momentum going."
                />
            )}

            <div className="grid grid-cols-12 gap-8">
                {/* Asymmetrical Main Area */}
                <div className="col-span-12 lg:col-span-9">
                    {/* Welcome Metadata */}
                    <div className="mb-8 flex justify-between items-end px-10">
                        <div>
                            <h2 className="text-4xl font-black text-white italic tracking-tighter neon-text-ai">MISSION_HUB_V2</h2>
                            <p className="text-xs tracking-[0.4em] text-purple-ai font-bold">WELCOME_BACK // {user?.name?.toUpperCase() || 'EXPLORER'}</p>
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Sector_Clearance</p>
                            <p className="text-xs font-mono text-purple-ai bg-purple-ai/10 px-3 py-1 rounded border border-purple-ai/20">LEVEL_4_AUTH</p>
                        </div>
                    </div>

                    {/* Mission Control Hub */}
                    <MissionControl user={JSON.parse(JSON.stringify(user))} />
                </div>

                {/* Tactical Sidebar Layer (Leaderboard / Ranking) */}
                <div className="col-span-12 lg:col-span-3 space-y-8">
                    <div className="glass-v2 p-6 rounded-[32px] border border-white/5 h-full">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-sun animate-pulse" /> Global_Ranks
                        </h3>
                        <Suspense fallback={<div className="h-64 bg-white/5 rounded-3xl animate-pulse" />}>
                            <Leaderboard />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
