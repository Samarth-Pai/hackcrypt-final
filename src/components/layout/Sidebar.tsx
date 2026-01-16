import Link from 'next/link';
import { LayoutDashboard, LogOut, Swords, Cpu, User, BookOpen } from 'lucide-react';
import { getUserProfile } from '@/lib/user';
import { logoutAction } from '@/app/actions/auth';
import SidebarProfile from './SidebarProfile';

export default async function Sidebar() {
    const user = await getUserProfile();

    // Calculate Progress to next level
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
        <aside className="w-64 bg-teal-muted/80 backdrop-blur-xl h-screen fixed left-0 top-0 border-r border-white/5 flex flex-col z-50">
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-2 group cursor-default">
                    <div className="w-8 h-8 rounded bg-purple-ai flex items-center justify-center neon-border-purple">
                        <Cpu size={18} className="text-white animate-pulse" />
                    </div>
                    <h1 className="text-xl font-bold font-mono tracking-tighter text-white neon-text-ai">EDU_QUEST</h1>
                </div>
            </div>

            {/* Tactical Profile Hub (Client Component) */}
            <SidebarProfile
                user={JSON.parse(JSON.stringify(user))}
                level={level}
                progressPercent={progressPercent}
            />

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
                <p className="px-4 text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black mb-4 mt-2">Core_Operations</p>

                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/5 group relative overflow-hidden">
                    <LayoutDashboard className="w-5 h-5 group-hover:text-green-neon transition-colors" />
                    <span className="text-sm font-bold uppercase tracking-wider">Control Hub</span>
                    <div className="absolute left-0 top-0 w-0.5 h-full bg-green-neon/0 group-hover:bg-green-neon transition-all" />
                </Link>


                <Link href="/syllabus" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/5 group relative overflow-hidden">
                    <BookOpen className="w-5 h-5 group-hover:text-green-neon transition-colors" />
                    <span className="text-sm font-bold uppercase tracking-wider">Syllabus Hub</span>
                    <div className="absolute left-0 top-0 w-0.5 h-full bg-green-neon/0 group-hover:bg-green-neon transition-all" />
                </Link>

                <Link href="/duels" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/5 group relative overflow-hidden">
                    <Swords className="w-5 h-5 group-hover:text-gold-streak transition-colors" />
                    <span className="text-sm font-bold uppercase tracking-wider">Battle Rift</span>
                    <div className="absolute left-0 top-0 w-0.5 h-full bg-gold-streak/0 group-hover:bg-gold-streak transition-all" />
                </Link>

                <div className="h-px bg-white/5 my-4 mx-4" />
                <p className="px-4 text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black mb-4">Social_Link</p>

                <Link href={`/profile/${user?._id}`} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/5 group relative overflow-hidden">
                    <User className="w-5 h-5 group-hover:text-purple-ai transition-colors" />
                    <span className="text-sm font-bold uppercase tracking-wider">My Profile</span>
                    <div className="absolute left-0 top-0 w-0.5 h-full bg-purple-ai/0 group-hover:bg-purple-ai transition-all" />
                </Link>
            </nav>

            <div className="p-6 border-t border-white/5 bg-black/20">
                <form action={logoutAction}>
                    <button type="submit" className="flex items-center gap-3 text-gray-500 hover:text-coral-error transition-colors text-xs font-bold uppercase tracking-widest group">
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>System_Exit</span>
                    </button>
                </form>
            </div>
        </aside>
    );
}
