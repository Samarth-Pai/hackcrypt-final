import { getUserProfile } from '@/lib/user';
import MissionControl from '@/components/dashboard/MissionControl';
import BadgeUnlock from '@/components/gamification/BadgeUnlock';
import DashboardGrid from '@/components/dashboard/DashboardGrid';
import InfinityStoneNav from '@/components/dashboard/InfinityStoneNav';

export default async function DashboardPage() {
    const user = await getUserProfile();
    const streakDays = user?.gamification?.streak?.count || 0;
    const lastActive = user?.gamification?.streak?.lastActive || null;

    return (
        <div className="relative min-h-screen p-6 md:p-8 overflow-hidden bg-[#050510] text-[#ededed]">

            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#1a1a2e] to-transparent opacity-60 pointer-events-none" />
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Achievement Layer */}
            {streakDays > 0 && (
                <BadgeUnlock
                    badgeName="First Sprint"
                    description="You've completed your first day of quests! Keep the momentum going."
                />
            )}

            <div className="relative z-10 max-w-7xl mx-auto space-y-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-6">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            COSMIC COMMAND
                        </h1>
                        <p className="text-sm tracking-[0.4em] text-cyan-500/80 font-bold mt-2 uppercase">
                            Welcome Explorer {user?.name ?? 'Unknown'}
                        </p>
                    </div>
                    <div className="hidden md:block text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[10px] text-cyan-400 font-mono">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            Security Clearance: LEVEL 4
                        </div>
                    </div>
                </div>

                {/* Infinity Stone Navigation */}
                <InfinityStoneNav />

                {/* Main Dashboard Grid with Collapsible Sidebar */}
                <DashboardGrid
                    user={JSON.parse(JSON.stringify(user))}
                    streakDays={streakDays}
                    lastActive={lastActive}
                />
            </div>
        </div>
    );
}
