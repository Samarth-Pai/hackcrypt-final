import Link from 'next/link';
import { Cpu, Trophy, BookOpen, Swords, LayoutDashboard, User, Map, Book } from 'lucide-react';
import { getUserProfile } from '@/lib/user';

export default async function TopNav() {
    const user = await getUserProfile();

    return (
        <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded bg-violet-600/20 flex items-center justify-center border border-violet-500/50 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300">
                        <Cpu size={18} className="text-violet-400 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-lg font-bold font-mono tracking-tighter text-slate-100 group-hover:text-violet-300 transition-colors">
                        COSMIC_CYPHER
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest font-bold text-slate-400">
                    {[
                        { href: '/dashboard', icon: LayoutDashboard, label: 'Control Hub' },
                        { href: '/learning-path', icon: Map, label: 'Learning Path' },
                        { href: '/story', icon: Book, label: 'Story Mode' },
                        { href: '/syllabus', icon: BookOpen, label: 'Syllabus' },
                        { href: '/duels', icon: Swords, label: 'Duels' },
                        { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="hover:text-cyan-400 flex items-center gap-2 transition-colors duration-200"
                        >
                            <item.icon size={14} /> {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <Link
                            href={`/profile/${user._id}`}
                            className="px-5 py-2 rounded-full border border-violet-500/30 text-xs font-black uppercase tracking-widest text-violet-400 hover:text-white hover:bg-violet-600/20 hover:border-violet-400 transition-all flex items-center gap-2 shadow-[0_0_10px_rgba(139,92,246,0.05)] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                        >
                            <User size={14} /> Profile
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="px-5 py-2 rounded-full border border-cyan-500/30 text-xs font-black uppercase tracking-widest text-cyan-400 hover:text-white hover:bg-cyan-600/20 hover:border-cyan-400 transition-all shadow-[0_0_10px_rgba(6,182,212,0.05)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
