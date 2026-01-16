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
    Atom
} from 'lucide-react';

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
        <div className="relative p-4 rounded-xl bg-[#0A0A1F]/80 backdrop-blur-md border border-white/10 group-hover:border-white/40 transition-all duration-500 shadow-xl flex flex-col items-center min-w-[120px]"
            style={{ boxShadow: `0 0 20px ${color}20` }}>
            <div style={{ color }} className="mb-2 transition-transform group-hover:scale-110">{icon}</div>
            <div className="space-y-0.5 text-center">
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">{label}</p>
                <p className="text-sm font-black text-white">{value}</p>
            </div>
            {/* Simple connecting line visual */}
            <div className="absolute top-1/2 left-1/2 w-[100px] h-px bg-gradient-to-r from-transparent to-white/10 -z-10 origin-left -rotate-45 opacity-0 group-hover:opacity-100 transition-opacity" />
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
        { id: 'accuracy', icon: <Target size={20} />, label: 'PRECISION', value: `${Math.round(accuracy)}%`, color: '#00FFFF', x: 8, y: 15, delay: 0 },
        { id: 'streak', icon: <Zap size={20} />, label: 'STREAK', value: `${user?.gamification?.streak?.count || 0} DAY`, color: '#FFD700', x: 82, y: 12, delay: 2 },
        { id: 'xp', icon: <Activity size={20} />, label: 'XP LOAD', value: `${xp}`, color: '#FF00FF', x: 12, y: 75, delay: 4 },
        { id: 'rank', icon: <Trophy size={20} />, label: 'RANK', value: '#12', color: '#FF4500', x: 78, y: 70, delay: 6 },
    ];

    return (
        <div className="relative w-full h-[550px] flex items-center justify-center select-none overflow-hidden rounded-[40px] bg-[#050510] border border-white/5 shadow-2xl">

            {/* Subtle Starfield */}
            <div className="absolute inset-0 bg-[url('/assets/stars.svg')] opacity-20" />

            {/* Background Rings - Cleaner */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <div className="w-[300px] h-[300px] border border-cyan-500/30 rounded-full animate-pulse" />
                <div className="absolute w-[450px] h-[450px] border border-white/10 rounded-full border-dashed animate-[spin_60s_linear_infinite]" />
            </div>

            {/* Main Central Reactor - Neat Level Display */}
            <div className="relative z-40 flex flex-col items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="w-56 h-56 rounded-full border border-white/10 relative flex items-center justify-center"
                >
                    {/* Ring Particles */}
                    <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]" />
                    <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]" />
                </motion.div>

                {/* Center Content - Static and Neat */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-40 h-40 rounded-full bg-black/50 backdrop-blur-sm border-2 border-white/5 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold mb-1">LEVEL</p>
                        <h2 className="text-6xl font-black text-white tracking-tighter drop-shadow-lg">{level}</h2>
                        <div className="mt-2 flex gap-1">
                            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse delay-75" />
                            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse delay-150" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tactical Orbs */}
            {orbs.map(orb => (
                <TacticalOrb key={orb.id} {...orb} onClick={setActiveTab} />
            ))}

            {/* Pop-up Panel would be here (activeTab logic) */}
            <AnimatePresence>
                {activeTab && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-8" onClick={() => setActiveTab(null)}>
                        <div className="bg-[#0f0f29] p-8 rounded-3xl border border-white/10 shadow-2xl max-w-sm w-full text-center">
                            <h3 className="text-xl font-bold text-white mb-2">Module Access Restricted</h3>
                            <p className="text-xs text-slate-400">Detailed biometric scan requires higher clearance.</p>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
