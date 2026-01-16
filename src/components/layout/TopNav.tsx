import Link from 'next/link';
import { Cpu, Trophy, BookOpen, Swords, LayoutDashboard, User, Map, Book } from 'lucide-react';
import { getUserProfile } from '@/lib/user';

export default async function TopNav() {
    const user = await getUserProfile();

    return (
        <nav className="sticky top-0 z-40 bg-teal-muted/80 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded bg-purple-ai flex items-center justify-center neon-border-purple">
                        <Cpu size={18} className="text-white animate-pulse" />
                    </div>
                    <span className="text-lg font-bold font-mono tracking-tighter text-white">EDU_QUEST</span>
                </Link>

                <div className="hidden md:flex items-center gap-4 text-xs uppercase tracking-widest font-black text-gray-400">
                    <Link href="/dashboard" className="hover:text-white flex items-center gap-2">
                        <LayoutDashboard size={14} /> Control Hub
                    </Link>
                    <Link href="/learning-path" className="hover:text-white flex items-center gap-2">
                        <Map size={14} /> Learning Path
                    </Link>
                    <Link href="/story" className="hover:text-white flex items-center gap-2">
                        <Book size={14} /> Story Mode
                    </Link>
                    <Link href="/syllabus" className="hover:text-white flex items-center gap-2">
                        <BookOpen size={14} /> Syllabus
                    </Link>
                    <Link href="/duels" className="hover:text-white flex items-center gap-2">
                        <Swords size={14} /> Duels
                    </Link>
                    <Link href="/leaderboard" className="hover:text-white flex items-center gap-2">
                        <Trophy size={14} /> Leaderboard
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <Link href={`/profile/${user._id}`} className="px-4 py-2 rounded-full border border-purple-ai/40 text-xs font-black uppercase tracking-widest text-purple-ai hover:text-white hover:border-white transition-all flex items-center gap-2">
                            <User size={14} /> Profile
                        </Link>
                    ) : (
                        <Link href="/login" className="px-4 py-2 rounded-full border border-purple-ai/40 text-xs font-black uppercase tracking-widest text-purple-ai hover:text-white hover:border-white transition-all">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
