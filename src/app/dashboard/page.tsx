import { Suspense } from 'react';
import Leaderboard from '@/components/gamification/Leaderboard';
import { getUserProfile } from '@/lib/user';
import { Calendar, CheckCircle, Target } from 'lucide-react';
import Link from 'next/link';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import BadgeUnlock from '@/components/gamification/BadgeUnlock';

export default async function DashboardPage() {
    const user = await getUserProfile();
    const totalQuestions = user?.performance?.totalQuestions || 0;
    const totalCorrect = user?.performance?.totalCorrect || 0;
    const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    const streakDays = user?.gamification?.streak?.count || 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Achievement Demo - Only for demonstration */}
            {streakDays > 0 && (
                <BadgeUnlock
                    badgeName="First Sprint"
                    description="You've completed your first day of quests! Keep the momentum going."
                />
            )}
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] p-8 rounded-2xl shadow-xl flex justify-between items-center text-white border border-[#C6FF00]/30 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Explorer'}!</h2>
                    <p className="text-gray-100 opacity-90">Your garden of knowledge is growing. Keep it up!</p>
                </div>
                <div className="absolute right-0 top-0 w-64 h-64 bg-[#C6FF00] rounded-full blur-[100px] opacity-20 -mr-16 -mt-16"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-[#5D4037]/40 p-6 rounded-xl border border-[#5D4037] hover-lift transition-all hover:bg-[#5D4037]/60 cursor-default group">
                            <div className="flex items-center gap-3 mb-2 text-gray-400 group-hover:text-lime-400 transition-colors">
                                <CheckCircle className="w-5 h-5" />
                                <span>Completed</span>
                            </div>
                            <p className="text-2xl font-bold text-[#ededed]">
                                <AnimatedNumber value={user?.gamification?.completedLessons || 0} />
                            </p>
                        </div>
                        <div className="bg-[#5D4037]/40 p-6 rounded-xl border border-[#5D4037] hover-lift transition-all hover:bg-[#5D4037]/60 cursor-default group">
                            <div className="flex items-center gap-3 mb-2 text-gray-400 group-hover:text-lime-400 transition-colors">
                                <Target className="w-5 h-5" />
                                <span>Accuracy</span>
                            </div>
                            <p className="text-2xl font-bold text-[#ededed]">
                                <AnimatedNumber value={Math.round(accuracy)} />%
                            </p>
                        </div>
                        <div className="bg-[#5D4037]/40 p-6 rounded-xl border border-[#5D4037] hover-lift transition-all hover:bg-[#5D4037]/60 cursor-default group">
                            <div className="flex items-center gap-3 mb-2 text-gray-400 group-hover:text-[#FFD600] transition-colors">
                                <Calendar className="w-5 h-5" />
                                <span>Streak</span>
                            </div>
                            <p className="text-2xl font-bold text-[#FFD600]">
                                <AnimatedNumber value={streakDays} /> Days
                            </p>
                        </div>
                    </div>

                    {/* Recommended Quests */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-[#ededed]">Available Quests</h3>
                        <div className="grid gap-4">
                            <Link href="/quiz" className="block group">
                                <div className="bg-[#2E7D32]/10 hover:bg-[#2E7D32]/20 border border-[#2E7D32] p-6 rounded-xl transition-all group-hover:transform group-hover:scale-[1.01] flex justify-between items-center">
                                    <div>
                                        <h4 className="text-lg font-bold text-[#C6FF00] group-hover:text-[#FFD600] transition-colors">Computer Science Basics</h4>
                                        <p className="text-sm text-gray-400">Master the fundamentals of binary and logic.</p>
                                    </div>
                                    <span className="px-4 py-2 bg-[#2E7D32] text-white rounded-full text-sm font-bold">Start +50 XP</span>
                                </div>
                            </Link>
                            <div className="bg-[#5D4037]/20 border border-[#5D4037] p-6 rounded-xl flex justify-between items-center opacity-70">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-400">Environmental Science</h4>
                                    <p className="text-sm text-gray-500">Unlocks at Level 3</p>
                                </div>
                                <span className="px-4 py-2 bg-[#5D4037] text-gray-400 rounded-full text-sm font-bold">Locked</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Leaderboard Column */}
                <div>
                    <Suspense fallback={<div className="h-64 bg-[#5D4037]/30 rounded-xl animate-pulse"></div>}>
                        <Leaderboard />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
