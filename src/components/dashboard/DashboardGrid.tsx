'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, LayoutDashboard, Zap } from 'lucide-react';
import MissionDirectory from './MissionDirectory';
import StreakPanel from './StreakPanel';

interface DashboardGridProps {
    user: any;
    streakDays: number;
    lastActive: string | null;
}

export default function DashboardGrid({ user, streakDays, lastActive }: DashboardGridProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="relative">
            {/* Collapse Toggle Button - Floating or Attached */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed md:absolute top-0 right-0 md:-top-16 md:right-0 z-50 p-2 bg-cyan-950/80 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-900/80 transition-all hover:border-cyan-400 flex items-center gap-2 group backdrop-blur-md"
            >
                <div className="text-[10px] uppercase font-bold tracking-widest hidden md:block group-hover:text-white transition-colors">
                    {isSidebarOpen ? 'Minimize Hud' : 'Expand Hud'}
                </div>
                {isSidebarOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content Area (Expands when sidebar is closed) */}
                <motion.div
                    layout
                    className={`flex-1 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]`}
                >
                    <MissionDirectory />
                </motion.div>

                {/* Collapsible Sidebar */}
                <AnimatePresence mode="popLayout">
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0, x: 50 }}
                            animate={{ width: 320, opacity: 1, x: 0 }}
                            exit={{ width: 0, opacity: 0, x: 50 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="w-full lg:w-[320px] shrink-0 space-y-6 overflow-hidden"
                        >
                            <div className="w-[320px]">
                                <StreakPanel streakCount={streakDays} lastActive={lastActive} />

                                {/* Placeholder for other sidebar widgets if needed */}
                                <div className="mt-6 p-6 rounded-2xl bg-[#0A0A1F] border border-cyan-500/20 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-10 pointer-events-none" />
                                    <div className="flex items-center gap-3 text-cyan-400 mb-2">
                                        <Zap size={18} />
                                        <h3 className="text-sm font-bold uppercase tracking-widest">System Status</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-slate-400 font-mono">
                                            <span>CORE</span>
                                            <span className="text-green-400">ONLINE</span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-800 rounded-full">
                                            <div className="h-full w-[92%] bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-400 font-mono">
                                            <span>NETWORK</span>
                                            <span className="text-cyan-400">SECURE</span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-800 rounded-full">
                                            <div className="h-full w-[100%] bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
