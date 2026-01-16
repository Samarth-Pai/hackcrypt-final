'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu,
    Zap,
    Target,
    Trophy,
    Activity,
    Info,
    X,
    Lock,
    MessageSquare
} from 'lucide-react';
import CosmicCard from '@/components/cosmic/CosmicCard';

interface TacticalOrbProps {
    id: string;
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
    x: number;
    y: number;
    delay: number;
    onClick: (id: string) => void;
}

const TacticalOrb = ({ id, icon, label, value, color, x, y, delay, onClick }: TacticalOrbProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: 1,
            scale: 1,
            x: [x, x + 10, x - 5, x],
            y: [y, y - 10, y + 5, y]
        }}
        transition={{
            delay,
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
        }}
        whileHover={{ scale: 1.1, filter: "brightness(1.5)" }}
        onClick={() => onClick(id)}
        className="absolute cursor-pointer z-30 group"
        style={{ left: `${x}%`, top: `${y}%` }}
    >
        <div className="relative p-5 rounded-2xl glass-cosmic border-2 border-transparent group-hover:border-white/20 transition-all duration-500 shadow-2xl"
            style={{ boxShadow: `0 0 20px ${color}20` }}>
            <div style={{ color }} className="mb-2">{icon}</div>
            <div className="space-y-0.5">
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black">{label}</p>
                <p className="text-sm font-black text-slate-100">{value}</p>
            </div>

            {/* Connector line to center (visual only) */}
            <div className="absolute top-1/2 left-1/2 w-25 h-px bg-gradient-to-r from-transparent to-white/5 -z-10 origin-left -translate-x-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    </motion.div>
);

export default function MissionControl({ user }: { user: any }) {
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const xp = user?.gamification?.xp || 0;
    const level = user?.gamification?.level || 1;
    const accuracy = user?.performance?.totalQuestions > 0
        ? (user?.performance?.totalCorrect / user?.performance?.totalQuestions) * 100
        : 0;

    const orbs = [
        { id: 'accuracy', icon: <Target size={24} />, label: 'Tactical_Precision', value: `${Math.round(accuracy)}%`, color: '#06b6d4', x: 15, y: 20, delay: 0 },
        { id: 'streak', icon: <Zap size={24} />, label: 'Momentum_Chain', value: `${user?.gamification?.streak?.count || 0} Days`, color: '#f59e0b', x: 75, y: 15, delay: 2 },
        { id: 'xp', icon: <Activity size={24} />, label: 'Neural_Load', value: `${xp} XP`, color: '#8b5cf6', x: 20, y: 70, delay: 4 },
        { id: 'rank', icon: <Trophy size={24} />, label: 'Elite_Standing', value: '#12 Rank', color: '#ec4899', x: 80, y: 65, delay: 6 },
    ];

    const panels: Record<string, React.ReactNode> = {
        accuracy: (
            <div className="space-y-6">
                <h3 className="text-2xl font-black text-cyan-400 text-glow uppercase tracking-tighter">Diagnostic Analytics</h3>
                <div className="grid grid-cols-1 gap-4">
                    {[
                        { label: 'Analytical Speed', val: '84ms', color: '#06b6d4' },
                        { label: 'Retention Flow', val: '92%', color: '#f59e0b' },
                        { label: 'Error Margin', val: '4%', color: '#ef4444' }
                    ].map(stat => (
                        <div key={stat.label} className="p-4 rounded-xl glass-cosmic border border-white/5 flex justify-between items-center group hover:border-cyan-500/30 transition-all">
                            <span className="text-xs uppercase tracking-widest text-slate-400">{stat.label}</span>
                            <span className="font-mono font-black text-slate-100" style={{ color: stat.color }}>{stat.val}</span>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-cyan-950/30 border border-cyan-500/10 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-cyan-400 mb-2 flex items-center gap-2">
                        <Info size={14} /> AI Recommendation
                    </p>
                    <p className="text-xs text-slate-400 italic leading-relaxed">
                        "Pattern detection suggests high mastery in Logic Gates. Recommend transitioning to Cryptography Phase 2."
                    </p>
                </div>
            </div>
        ),
        xp: (
            <div className="space-y-6">
                <h3 className="text-2xl font-black text-violet-400 text-glow uppercase tracking-tighter">Experience Matrix</h3>
                <div className="relative h-48 w-full glass-cosmic rounded-2xl overflow-hidden border border-white/5 p-6 font-mono">
                    <div className="flex justify-between items-end h-full gap-2">
                        {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    className="w-full bg-gradient-to-t from-violet-600/20 to-violet-500 rounded-t-sm"
                                />
                                <span className="text-[8px] text-slate-500">D{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="w-full py-4 rounded-xl bg-violet-600 text-slate-100 font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform shadow-lg shadow-violet-900/20">
                    Claim Weekly Surplus: +250 XP
                </button>
            </div>
        )
    };

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center select-none overflow-hidden">

            {/* Background Orbital Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <div className="w-[400px] h-[400px] border border-violet-500 rounded-full animate-pulse" />
                <div className="absolute w-[600px] h-[600px] border border-white/10 rounded-full border-dashed animate-[spin_60s_linear_infinite]" />
                <div className="absolute w-[800px] h-[800px] border border-violet-500/20 rounded-full animate-[spin_45s_linear_infinite_reverse]" />
            </div>

            {/* Main AI Neural Core */}
            <div className="relative z-40 group">
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-72 h-72 rounded-full glass-cosmic flex flex-col items-center justify-center relative overflow-hidden group-hover:shadow-[0_0_80px_rgba(168,85,247,0.3)] transition-all duration-700 border border-violet-500/20"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.2)_0%,_transparent_70%)] group-hover:scale-150 transition-transform duration-1000" />
                    <Cpu size={64} className="text-violet-400 mb-4 text-glow animate-pulse" />
                    <div className="text-center relative z-10">
                        <p className="text-[10px] uppercase tracking-[0.5em] text-slate-500 font-black mb-1">Neural_Core</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black text-slate-100 italic tracking-tighter">LVL_{level}</span>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-1.5 h-4 items-end">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ height: [4, 16, 4] }}
                                transition={{ duration: 0.6 + i * 0.1, repeat: Infinity }}
                                className="w-1 bg-violet-500/50 rounded-full"
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Core Info Tooltip */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap">
                    <div className="glass-cosmic px-4 py-2 rounded-lg border border-violet-500/30 text-[10px] uppercase tracking-widest font-bold text-violet-400">
                        System Status: Optimal | Sync Rate: 98.4%
                    </div>
                </div>
            </div>

            {/* Tactical Orbs */}
            {orbs.map(orb => (
                <TacticalOrb key={orb.id} {...orb} onClick={setActiveTab} />
            ))}

            {/* Side HUD: Live Feed (Left) */}
            <div className="absolute left-4 bottom-10 w-64 z-40 hidden md:block">
                <div className="glass-cosmic p-6 rounded-3xl border border-white/5">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black mb-6 flex items-center gap-2">
                        <MessageSquare size={14} /> Neural_Sync_Feed
                    </h3>
                    <div className="space-y-4 h-48 overflow-y-auto">
                        {[
                            { msg: 'Badge "Cipher King" Unlocked', sub: 'Achievement synchronization complete', color: '#e2e8f0' },
                            { msg: 'Global Shift: Tier 3 Battle', sub: 'Matchmaking sequence initiated', color: '#22d3ee' },
                            { msg: 'Daily Log Sequence Validated', sub: '+1 Momentum Chain verified', color: '#e2e8f0' }
                        ].map((idx, i) => (
                            <div key={i} className="relative pl-3 border-l-2 border-white/5 py-1">
                                <p className="text-[10px] font-bold text-slate-100 mb-0.5" style={{ color: idx.color }}>{idx.msg}</p>
                                <p className="text-[8px] uppercase tracking-wider text-slate-500">{idx.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pop-up Panel Overlay */}
            <AnimatePresence>
                {activeTab && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveTab(null)}
                            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl"
                        />
                        <motion.div
                            layoutId={activeTab}
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
                        >
                            <div className="w-full max-w-xl glass-cosmic p-12 rounded-[40px] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] pointer-events-auto relative">
                                <button
                                    onClick={() => setActiveTab(null)}
                                    className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                                {panels[activeTab] || (
                                    <div className="text-center py-10">
                                        <Lock size={48} className="text-slate-700 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-slate-100 mb-2 uppercase tracking-widest">Module Encrypted</h3>
                                        <p className="text-xs text-slate-500 max-w-xs mx-auto uppercase tracking-wider leading-relaxed">
                                            Requires Level 5 clearance to view full biometric telemetry.
                                            Continue missions to unlock.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
