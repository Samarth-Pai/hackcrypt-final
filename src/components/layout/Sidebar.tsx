import Link from 'next/link';
import { LayoutDashboard, Gamepad2, LogOut, BarChart3, Swords } from 'lucide-react';
import { getUserProfile } from '@/lib/user';
import { logoutAction } from '@/app/actions/auth';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

export default async function Sidebar() {
    const user = await getUserProfile();

    // Calculate Progress to next level
    // Level = Math.floor(Math.sqrt(totalXP / 100)) + 1
    // Logic: XP needed for next level?
    // Level N starts at (N-1)^2 * 100 XP
    // Level N+1 starts at N^2 * 100 XP
    const xp = user?.gamification?.xp || 0;
    const level = user?.gamification?.level || 1;
    const currentLevelStartXP = Math.pow(level - 1, 2) * 100;
    const nextLevelStartXP = Math.pow(level, 2) * 100;
    const xpForNextLevel = nextLevelStartXP - currentLevelStartXP;
    const currentLevelProgress = xp - currentLevelStartXP;

    // Safe division
    const progressPercent = xpForNextLevel > 0
        ? (currentLevelProgress / xpForNextLevel) * 100
        : 0;

    return (
        <aside className="w-64 bg-earth h-screen fixed left-0 top-0 border-r border-[#5D4037] flex flex-col">
            <div className="p-6 border-b border-[#5D4037]">
                <h1 className="text-2xl font-bold font-mono tracking-tighter text-growth">EduQuest</h1>
            </div>

            {/* User Mini Profile */}
            <div className="p-6 bg-forest/10 border-b border-[#5D4037]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-sun flex items-center justify-center text-earth font-bold">
                        {user?.name?.[0]?.toUpperCase() || 'E'}
                    </div>
                    <div>
                        <p className="font-bold text-[#ededed] truncate max-w-30">{user?.name || 'Explorer'}</p>
                        <p className="text-xs text-growth">Level {level}</p>
                    </div>
                </div>

                {/* XP Bar */}
                <div className="w-full h-2 bg-[#1B1B1B] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-growth"
                        style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                    ></div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 text-right">
                    <AnimatedNumber value={Math.floor(currentLevelProgress)} /> / {xpForNextLevel} XP
                </p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-forest/20 text-gray-300 hover:text-white transition-colors hover-lift group">
                    <LayoutDashboard className="w-5 h-5 group-hover:text-growth transition-colors" />
                    <span>Dashboard</span>
                </Link>
                <Link href="/quiz" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-forest/20 text-gray-300 hover:text-white transition-colors hover-lift group">
                    <Gamepad2 className="w-5 h-5 group-hover:text-growth transition-colors" />
                    <span>Quests</span>
                </Link>
                <Link href="/duels" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-forest/20 text-gray-300 hover:text-white transition-colors hover-lift group">
                    <Swords className="w-5 h-5 group-hover:text-sun transition-colors" />
                    <span>Live Duels</span>
                </Link>
                <Link href="/teacher/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-forest/20 text-gray-300 hover:text-white transition-colors border-l-2 border-lime-500/0 hover:border-lime-500/50 hover-lift group">
                    <BarChart3 className="w-5 h-5 text-lime-400 group-hover:text-lime-300 transition-colors" />
                    <span className="text-lime-50">Analytics</span>
                </Link>
            </nav>

            <div className="p-6 border-t border-[#5D4037]">
                <form action={logoutAction}>
                    <button type="submit" className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </form>
            </div>
        </aside>
    );
}
