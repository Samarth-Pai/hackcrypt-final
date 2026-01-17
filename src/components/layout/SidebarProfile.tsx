'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SidebarProfileProps {
    user: any;
    level: number;
    progressPercent: number;
    isCollapsed?: boolean;
}

export default function SidebarProfile({ user, level, progressPercent, isCollapsed }: SidebarProfileProps) {
    return (
        <div className={`border-b border-white/5 neural-bg relative overflow-hidden transition-all duration-300 ${isCollapsed ? 'p-4' : 'p-6'}`}>
            <div className={`flex items-center gap-3 relative z-10 transition-all ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-purple-ai/20 flex items-center justify-center text-purple-ai font-black text-xl border border-purple-ai/50 neon-border-purple group-hover:scale-110 transition-transform">
                        {user?.name?.[0]?.toUpperCase() || 'E'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-neon border-2 border-teal-bg animate-pulse" />
                </div>

                {!isCollapsed && (
                    <div className="overflow-hidden whitespace-nowrap">
                        <p className="font-bold text-white tracking-tight truncate max-w-[120px]">{user?.name || 'Explorer'}</p>
                        <div className="flex items-center gap-1.5 overflow-hidden">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-ai/40" />
                            <p className="text-[10px] uppercase tracking-[0.2em] text-purple-ai font-bold">LVL {level}_CMD</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Neural Progress Bar */}
            {!isCollapsed && (
                <div className="space-y-2 relative z-10 mt-6 animate-fadeIn">
                    <div className="flex justify-between items-end">
                        <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Neural Sync</span>
                        <span className="text-[10px] font-mono text-purple-ai">{Math.floor(progressPercent)}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-purple-ai to-cyber-blue shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
