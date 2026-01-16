import { getUserProfile } from '@/lib/user';
import MissionControl from '@/components/dashboard/MissionControl';
import BadgeUnlock from '@/components/gamification/BadgeUnlock';
import ActiveMissions from '@/components/dashboard/ActiveMissions';
import SyllabusSection from '@/components/dashboard/SyllabusSection';

export default async function DashboardPage() {
    const user = await getUserProfile();
    const streakDays = user?.gamification?.streak?.count || 0;

    return (
        <div className="relative min-h-screen p-6 md:p-8">
            {/* Achievement Layer */}
            {streakDays > 0 && (
                <BadgeUnlock
                    badgeName="First Sprint"
                    description="You've completed your first day of quests! Keep the momentum going."
                />
            )}

            <div className="grid grid-cols-12 gap-8">
                {/* Asymmetrical Main Area */}
                <div className="col-span-12 lg:col-span-8">
                    {/* Welcome Metadata */}
                    <div className="mb-8 flex flex-col md:flex-row justify-between md:items-end px-2 gap-4">
                        <div>
                            <h2 className="text-4xl font-bold italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-glow">
                                MISSION_HUB_V2
                            </h2>
                            <p className="text-xs tracking-[0.4em] text-cyan-500/80 font-bold mt-2">
                                WELCOME DECLARATION • {user?.name?.toUpperCase() ?? 'EXPLORER'}
                            </p>
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                                Sector_Clearance
                            </p>
                            <p className="text-xs font-mono text-cyan-400 bg-cyan-900/20 px-3 py-1 rounded border border-cyan-500/30">
                                LEVEL_4_AUTH
                            </p>
                        </div>
                    </div>

                    {/* Mission Control Hub */}
                    <MissionControl user={JSON.parse(JSON.stringify(user))} />
                </div>

                {/* Tactical Sidebar Layer (Active Missions) */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <ActiveMissions />
                </div>

                {/* Syllabus Section (Full Width) */}
                <div className="col-span-12">
                    <SyllabusSection />
                </div>
            </div>
        </div>
    );
}
