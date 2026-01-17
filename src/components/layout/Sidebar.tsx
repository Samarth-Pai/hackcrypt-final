'use client';

import Link from 'next/link';
import { LayoutDashboard, LogOut, Swords, Cpu, User, BookOpen, Trophy, Map, Book, ChevronRight, ChevronLeft } from 'lucide-react';
import { logoutAction } from '@/app/actions/auth';
import SidebarProfile from './SidebarProfile';

interface SidebarProps {
    user: any;
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

export default function Sidebar({ user, isCollapsed, toggleCollapse }: SidebarProps) {
    // Calculate Progress to next level (Logic moved from async component)
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

    const navItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Control Hub', color: 'group-hover:text-green-neon', bgColor: 'group-hover:bg-green-neon' },
        { href: '/syllabus', icon: BookOpen, label: 'Syllabus Hub', color: 'group-hover:text-green-neon', bgColor: 'group-hover:bg-green-neon' },
        { href: '/learning-path', icon: Map, label: 'Learning Path', color: 'group-hover:text-sun', bgColor: 'group-hover:bg-sun' },
        { href: '/story', icon: Book, label: 'Story Mode', color: 'group-hover:text-growth', bgColor: 'group-hover:bg-growth' },
        { href: '/duels', icon: Swords, label: 'Battle Rift', color: 'group-hover:text-gold-streak', bgColor: 'group-hover:bg-gold-streak' },
        { href: '/leaderboard', icon: Trophy, label: 'Global Leaderboard', color: 'group-hover:text-sun', bgColor: 'group-hover:bg-sun' },
    ];

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-teal-muted/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-50 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Header / Toggle */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className={`flex items-center gap-2 group cursor-default overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                    <div className="w-8 h-8 rounded bg-purple-ai flex items-center justify-center neon-border-purple shrink-0">
                        <Cpu size={18} className="text-white animate-pulse" />
                    </div>
                    <h1 className="text-xl font-bold font-mono tracking-tighter text-white neon-text-ai">EDU_QUEST</h1>
                </div>

                {isCollapsed && (
                    <div className="w-full flex justify-center mb-2">
                        <div className="w-8 h-8 rounded bg-purple-ai flex items-center justify-center neon-border-purple">
                            <Cpu size={18} className="text-white" />
                        </div>
                    </div>
                )}

                <button
                    onClick={toggleCollapse}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors absolute right-2 top-6 md:static"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Tactical Profile Hub */}
            <SidebarProfile
                user={user}
                level={level}
                progressPercent={progressPercent}
                isCollapsed={isCollapsed}
            />

            <nav className="flex-1 p-3 space-y-2 overflow-y-auto no-scrollbar overflow-x-hidden">
                {!isCollapsed && (
                    <p className="px-4 text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black mb-4 mt-2">Core_Operations</p>
                )}

                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/5 group relative overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? item.label : ''}
                    >
                        <item.icon className={`w-5 h-5 transition-colors ${item.color.replace('group-hover:', (isCollapsed ? 'text-' : 'group-hover:text-'))}`} />

                        {!isCollapsed && (
                            <span className="text-sm font-bold uppercase tracking-wider">{item.label}</span>
                        )}

                        {!isCollapsed && (
                            <div className={`absolute left-0 top-0 w-0.5 h-full transition-all ${item.bgColor.replace('group-hover:', 'bg-').replace('bg-', '')}/0 ${item.bgColor} `} />
                        )}
                    </Link>
                ))}

                <div className="h-px bg-white/5 my-4 mx-4" />

                {!isCollapsed && (
                    <p className="px-4 text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black mb-4">Social_Link</p>
                )}

                <Link
                    href={`/profile/${user?._id}`}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/5 group relative overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? "My Profile" : ''}
                >
                    <User className="w-5 h-5 group-hover:text-purple-ai transition-colors" />
                    {!isCollapsed && <span className="text-sm font-bold uppercase tracking-wider">My Profile</span>}
                </Link>
            </nav>

            <div className={`p-4 border-t border-white/5 bg-black/20 ${isCollapsed ? 'flex justify-center' : ''}`}>
                <form action={logoutAction}>
                    <button type="submit" className={`flex items-center gap-3 text-gray-500 hover:text-coral-error transition-colors text-xs font-bold uppercase tracking-widest group`}>
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        {!isCollapsed && <span>System_Exit</span>}
                    </button>
                </form>
            </div>
        </aside>
    );
}
