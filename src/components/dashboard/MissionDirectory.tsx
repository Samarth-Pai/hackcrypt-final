'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Shield, Zap, Crosshair, FolderOpen, AlertTriangle } from 'lucide-react';

interface Quest {
    id: string;
    title: string;
    description: string;
    progress: number;
    target: number;
    rewardXp: number;
}

export default function MissionDirectory() {
    const [quests, setQuests] = useState<Quest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadQuests = async () => {
            try {
                const response = await fetch('/api/quests');
                if (response.ok) {
                    const data = await response.json();
                    setQuests(data.quests || []);
                }
            } catch (error) {
                console.error("Failed to load mission directives:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadQuests();
    }, []);

    return (
        <div className="relative z-10 font-sans h-full">
            {/* Marvel Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse" />
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-900 to-black border border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] relative z-10">
                        <Map size={32} />
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                        MISSION DIRECTORY
                    </h2>
                    <p className="text-xs text-cyan-500/80 font-mono tracking-[0.2em] flex items-center gap-2 mt-1">
                        <Shield size={12} /> ACTIVE DIRECTIVES
                    </p>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 via-cyan-900/20 to-transparent ml-6" />
            </div>

            {/* Campaign Grid */}
            <div className="relative min-h-[400px]">
                {/* Connecting Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-slate-800 -translate-y-1/2 hidden lg:block opacity-30 blur-[2px]" />

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-48 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 animate-pulse" />
                        ))}
                    </div>
                ) : quests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-cyan-500/30 rounded-3xl bg-cyan-950/10">
                        <AlertTriangle className="text-cyan-500 mb-4 opacity-50" size={48} />
                        <h3 className="text-xl font-bold text-cyan-200 uppercase tracking-widest mb-2">No Active Directives</h3>
                        <p className="text-slate-400 text-sm max-w-md text-center">
                            All current operations have been neutralized. Await further instructions from Central Command or initialize new protocols in the Story Mode.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {quests.map((quest, idx) => {
                            const progressPct = Math.min(100, Math.round((quest.progress / quest.target) * 100));
                            return (
                                <motion.div
                                    key={quest.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative group h-full"
                                >
                                    <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl blur-xl group-hover:bg-cyan-500/10 transition-colors opacity-0 group-hover:opacity-100 duration-500" />

                                    <div className="relative h-full flex flex-col p-6 rounded-2xl bg-[#0A0A1F] border border-cyan-500/20 group-hover:border-cyan-400 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300 overflow-hidden">
                                        {/* Background Grid */}
                                        <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-5 pointer-events-none" />

                                        {/* Holographic Scan Effect */}
                                        <div className="absolute inset-x-0 top-0 h-1 bg-cyan-400/50 blur-[2px] -translate-y-full group-hover:translate-y-[200px] transition-transform duration-1000 ease-in-out" />

                                        <div className="flex justify-between items-start mb-4">
                                            <div className="px-2 py-1 rounded bg-cyan-950/50 border border-cyan-500/30 text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                                                Active Protocol
                                            </div>
                                            <Zap size={16} className="text-amber-400" />
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors line-clamp-1">
                                            {quest.title}
                                        </h3>

                                        <p className="text-xs text-slate-400 mb-6 line-clamp-2 leading-relaxed flex-grow">
                                            {quest.description}
                                        </p>

                                        <div className="space-y-2 mt-auto">
                                            <div className="flex justify-between text-[10px] font-mono uppercase text-cyan-500/60">
                                                <span>Progress</span>
                                                <span>{progressPct}% Complete</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_cyan]"
                                                    style={{ width: `${progressPct}%` }}
                                                />
                                            </div>

                                            <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between">
                                                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                                                    +{quest.rewardXp} XP REWARD
                                                </span>
                                                <button className="text-xs font-bold text-cyan-400 hover:text-white transition-colors flex items-center gap-1 group/btn">
                                                    ENGAGE <Crosshair size={12} className="group-hover/btn:rotate-90 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
