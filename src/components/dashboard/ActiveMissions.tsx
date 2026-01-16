'use client';

import { useEffect, useState } from 'react';
import { Activity, Shield, Crosshair, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ActiveMissions() {
    const [quests, setQuests] = useState<Array<{ id: string; title: string; description: string; progress: number; target: number; rewardXp: number }>>([]);

    useEffect(() => {
        const loadQuests = async () => {
            const response = await fetch('/api/quests');
            if (response.ok) {
                const data = await response.json();
                setQuests(data.quests || []);
            }
        };

        loadQuests();
    }, []);

    return (
        <div className="relative">
            {/* Header HUD */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2 text-cyan-400">
                    <Crosshair size={16} className="animate-spin-slow" />
                    <h3 className="text-xs uppercase tracking-[0.3em] font-black text-glow">Current Directives</h3>
                </div>
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse delay-75" />
                    <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse delay-150" />
                </div>
            </div>

            <div className="space-y-3">
                {quests.length === 0 && (
                    <div className="p-6 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-400/60 font-mono text-center">
                        <span className="animate-pulse">_SCANNING FOR OBJECTIVES...</span>
                    </div>
                )}

                {quests.map((quest, idx) => {
                    const progressPct = Math.min(100, Math.round((quest.progress / quest.target) * 100));
                    return (
                        <motion.div
                            key={quest.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-4 rounded-xl bg-[#0A0A1F] border border-cyan-500/20 group hover:border-cyan-400/60 transition-all cursor-pointer relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.05)] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                        >
                            {/* Background Grid */}
                            <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-5 pointer-events-none" />

                            {/* Holographic Flash */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-100 mb-1 tracking-tight group-hover:text-cyan-300 transition-colors">{quest.title}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[9px] text-amber-400 font-bold flex items-center gap-1">
                                            <Zap size={8} /> +{quest.rewardXp} XP
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium mt-2 leading-relaxed max-w-[90%]">{quest.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-mono text-cyan-400 mb-1">{progressPct}%</div>
                                    <Shield size={14} className="text-cyan-500/40 ml-auto" />
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-3 relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPct}%` }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                                />
                            </div>

                            <div className="mt-1 flex justify-between text-[8px] uppercase tracking-wider text-slate-600 font-mono">
                                <span>Status: Active</span>
                                <span>{quest.progress}/{quest.target}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
