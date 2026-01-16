'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu,
    Zap,
    Shield,
    Target,
    Users,
    Activity,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Info,
    X,
    ChevronRight
} from 'lucide-react';

interface OrbProps {
    id: string;
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
    delay: number;
    onClick: (id: string) => void;
}

const InsightOrb = ({ icon, label, value, color, delay, onClick, id }: OrbProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: 1,
            scale: 1,
            y: [0, -10, 0],
        }}
        transition={{
            delay,
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        whileHover={{ scale: 1.1, filter: "brightness(1.5)" }}
        onClick={() => onClick(id)}
        className="absolute cursor-pointer group"
        style={{
            left: `${(Math.cos(delay * 2) * 35) + 50}%`,
            top: `${(Math.sin(delay * 2) * 35) + 50}%`
        }}
    >
        <div className={`relative p-4 rounded-2xl glass-v2 border-2 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(var(--orb-color),0.5)]`}
            style={{ borderColor: color, '--orb-color': color === '#1ED760' ? '30,215,96' : '255,255,255' } as any}>
            <div className="text-white mb-1">{icon}</div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">{label}</p>
                <p className="text-sm font-bold" style={{ color }}>{value}</p>
            </div>
        </div>
    </motion.div>
);

export default function CommandCenter() {
    const [activePanel, setActivePanel] = useState<string | null>(null);
    const [pulseSize, setPulseSize] = useState(1);

    // Pulse effect logic
    useEffect(() => {
        const interval = setInterval(() => {
            setPulseSize(s => s === 1 ? 1.05 : 1);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const orbs = [
        { id: 'weak', icon: <AlertTriangle size={20} />, label: 'Weak Topics', value: '4 Areas', color: '#1ED760', delay: 0 },
        { id: 'engagement', icon: <Users size={20} />, label: 'Engagement', value: '92%', color: '#FFFFFF', delay: 1.5 },
        { id: 'battles', icon: <Zap size={20} />, label: 'Live Battles', value: '12 Active', color: '#1ED760', delay: 3 },
        { id: 'performers', icon: <TrendingUp size={20} />, label: 'Top Players', value: '8 Elite', color: '#FFFFFF', delay: 4.5 },
    ];

    const panels: Record<string, React.ReactNode> = {
        weak: (
            <div className="space-y-6">
                <h3 className="text-xl font-bold neon-text text-[#1ED760]">Critical Vulnerabilities</h3>
                <div className="grid grid-cols-2 gap-4">
                    {['Asymmetric Encryption', 'Network Security', 'Buffer Overflows', 'SQL Injection'].map(topic => (
                        <div key={topic} className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-default">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">{topic}</span>
                                <span className="text-xs text-red-500">42% Accuracy</span>
                            </div>
                            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '42%' }}
                                    className="h-full bg-red-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 rounded-xl glass-panel border-l-4 border-[#1ED760]">
                    <div className="flex gap-3">
                        <Info className="text-[#1ED760] shrink-0" />
                        <div>
                            <p className="text-xs font-bold uppercase text-[#1ED760] mb-1">AI Recommendation</p>
                            <p className="text-sm text-gray-300">Deploying "Sanitizer Quest" to address SQL Injection weaknesses. Expected improvement: +15%.</p>
                        </div>
                    </div>
                </div>
            </div>
        ),
        engagement: (
            <div className="space-y-6">
                <h3 className="text-xl font-bold neon-text text-[#FFFFFF]">Class Synchronization</h3>
                <div className="flex items-center gap-8 p-6 rounded-2xl bg-[#FFFFFF]/5 border border-[#FFFFFF]/20">
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full rotate-[-90deg]">
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                            <motion.circle
                                cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                                strokeDasharray="364.4"
                                initial={{ strokeDashoffset: 364.4 }}
                                animate={{ strokeDashoffset: 364.4 * (1 - 0.92) }}
                                className="text-[#FFFFFF]"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black">92%</span>
                            <span className="text-[10px] uppercase tracking-tighter text-gray-400">Sync Rate</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400 text-xs uppercase">Avg Session Depth</span>
                            <span className="font-bold">42m 12s</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400 text-xs uppercase">Milestones Reached</span>
                            <span className="font-bold text-[#FFFFFF]">128 Today</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400 text-xs uppercase">Active Collaborations</span>
                            <span className="font-bold">24 Teams</span>
                        </div>
                    </div>
                </div>
            </div>
        ),
        battles: (
            <div className="space-y-6">
                <h3 className="text-xl font-bold neon-text text-[#1ED760]">Live Operations</h3>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl glass-panel group hover:bg-cyan-500/10 transition-all border-r-2 border-cyan-500/0 hover:border-cyan-500/50">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                                <div>
                                    <p className="text-sm font-bold text-white">Battle #{2400 + i}</p>
                                    <p className="text-[10px] uppercase text-gray-500">Tier: Elite | Topic: Cryptography</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="text-right">
                                    <p className="text-xs font-bold text-cyan-400">MATCHED</p>
                                    <p className="text-[10px] text-gray-500">2:45 ELAPSED</p>
                                </div>
                                <ChevronRight className="text-gray-700 group-hover:text-cyan-400 transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        performers: (
            <div className="space-y-6">
                <h3 className="text-xl font-bold neon-text text-[#FFFFFF]">Elite Candidates</h3>
                <div className="grid grid-cols-1 gap-3">
                    {['Samarth Pai', 'Rhea Sharma', 'Aryan Gupta'].map((name, i) => (
                        <div key={name} className="flex items-center gap-4 p-4 rounded-xl glass-panel relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <Shield size={60} className="text-yellow-500" />
                            </div>
                            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-black text-xl border border-yellow-500/50">
                                {i + 1}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-white">{name}</h4>
                                <p className="text-[10px] uppercase tracking-wider text-yellow-500/70">Score: {12000 - (i * 450)} XP | Lvl 24</p>
                            </div>
                            <TrendingUp className="text-emerald-500" size={20} />
                        </div>
                    ))}
                </div>
                <button className="w-full py-3 rounded-xl bg-yellow-400 text-black font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform">
                    Generate Full Hall of Fame
                </button>
            </div>
        )
    };

    return (
        <div className="min-h-screen bg-teal-bg text-white p-8 relative overflow-hidden pixel-grid-v2 select-none">

            {/* Background Ambience */}
            <div className="absolute inset-0 neural-bg opacity-30 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-ai/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Header Info */}
            <div className="relative z-10 flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-4xl font-black neon-text-ai text-purple-ai mb-2 tracking-tighter italic">Neural_Cmd_Deck v2.1</h1>
                    <div className="flex items-center gap-4 text-[10px] tracking-[0.3em] text-purple-ai/60 font-black uppercase">
                        <span className="flex items-center gap-1"><Activity size={14} /> Neural Status: SYNCED</span>
                        <span className="flex items-center gap-1"><Shield size={14} /> Encryption: LEVEL 5</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-black text-white/10 italic">01.16.2026</p>
                    <p className="text-[10px] tracking-[0.5em] text-purple-ai font-black uppercase">Cyber_Operations</p>
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-12 gap-8 min-h-[700px]">

                {/* Left Col: Activity Feed */}
                <div className="col-span-3 space-y-6">
                    <div className="glass-panel p-6 rounded-3xl neon-border relative overflow-hidden h-full">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#1ED760]/50 to-transparent animate-scanline" />
                        <h3 className="text-xs uppercase tracking-[0.3em] text-[#1ED760] mb-6 flex items-center gap-2">
                            <Activity size={16} /> Neural Activity Feed
                        </h3>
                        <div className="space-y-6 overflow-y-auto max-h-[600px] no-scrollbar">
                            {[
                                { time: '14:22', event: 'DIFFICULTY INCREASED', desc: 'Class mastery reached 88%', icon: <TrendingUp size={14} />, color: '#1ED760' },
                                { time: '14:20', event: 'BADGE UNLOCKED', desc: 'Samarth unboxed "Cipher King"', icon: <Zap size={14} />, color: '#FFFFFF' },
                                { time: '14:15', event: 'BATTLE DETECTED', desc: 'Tier 3 matchup initiated', icon: <Target size={14} />, color: '#1ED760' },
                                { time: '14:10', event: 'SYS AUTO-ADAPT', desc: 'Adjusting easy/hard ratio (↓ 0.2)', icon: <TrendingDown size={14} />, color: '#FFFFFF' },
                            ].map((item, i) => (
                                <div key={i} className="relative pl-6 border-l border-white/10 py-1">
                                    <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-white/20" />
                                    <p className="text-[10px] text-gray-500 mb-1">{item.time} — SYSTEM</p>
                                    <p className="text-xs font-bold mb-1" style={{ color: item.color }}>{item.event}</p>
                                    <p className="text-xs text-gray-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center: AI Core and Orbs */}
                <div className="col-span-6 relative flex items-center justify-center">

                    {/* AI Core Hub */}
                    <motion.div
                        animate={{ scale: pulseSize }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="relative z-20 w-80 h-80 flex items-center justify-center"
                    >
                        {/* Pulsing Outer Ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-purple-ai/10 animate-ping" />
                        <div className="absolute inset-[-20px] rounded-full border border-purple-ai/10" />

                        {/* Main Hub Body */}
                        <div className="w-full h-full rounded-full glass-v2-glow border-4 border-purple-ai/40 flex items-center justify-center flex-col relative overflow-hidden group">
                            <div className="absolute inset-0 bg-purple-ai/5 group-hover:bg-purple-ai/10 transition-colors" />
                            <Cpu size={60} className="text-purple-ai mb-4 animate-pulse neon-text-ai" />
                            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black mb-2">NEURAL CORE</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black text-white neon-text-ai italic tracking-tighter">LVL_24</span>
                            </div>
                            <div className="mt-6 flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [10, 25, 10] }}
                                        transition={{ duration: 0.5 + i * 0.1, repeat: Infinity }}
                                        className="w-1 bg-purple-ai/50 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating Insight Orbs */}
                    {orbs.map(orb => (
                        <InsightOrb key={orb.id} {...orb} onClick={setActivePanel} />
                    ))}

                    {/* Connected Orbital Lines */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <div className="w-[450px] h-[450px] border border-[#1ED760] rounded-full" />
                        <div className="absolute w-[600px] h-[600px] border border-green-500/50 rounded-full border-dashed animate-spin-slow" style={{ animationDuration: '30s' }} />
                    </div>
                </div>

                {/* Right Col: Adaptive AI & Heat Zone */}
                <div className="col-span-3 space-y-6">

                    {/* Heat Zone */}
                    <div className="glass-panel p-6 rounded-3xl neon-border">
                        <h3 className="text-xs uppercase tracking-[0.3em] text-[#FF5252] mb-6 flex items-center gap-2">
                            <Zap size={16} /> Critical Heat Zones
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                            {[...Array(16)].map((_, i) => {
                                const intensity = Math.random();
                                return (
                                    <div
                                        key={i}
                                        className="aspect-square rounded-sm transition-all duration-500 hover:scale-110 cursor-help"
                                        style={{
                                            backgroundColor: intensity > 0.7 ? '#FF5252' : intensity > 0.4 ? '#FFD600' : '#2E7D32',
                                            opacity: 0.2 + intensity * 0.8,
                                            boxShadow: intensity > 0.8 ? '0 0 10px #FF5252' : 'none'
                                        }}
                                    />
                                );
                            })}
                        </div>
                        <p className="mt-4 text-[10px] text-center text-gray-500 uppercase tracking-widest">
                            High Intensity = Concept Friction Detected
                        </p>
                    </div>

                    {/* AI Decision Panel */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-[#1ED760]/30 transition-colors">
                        <h3 className="text-xs uppercase tracking-[0.3em] text-[#1ED760] mb-6 flex items-center gap-2">
                            <Cpu size={16} /> AI Decision Engine
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 mb-2">
                                    <span>Adaptive Difficulty</span>
                                    <span className="text-red-400">HARD ↑</span>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-xs text-gray-300 leading-relaxed italic">
                                    "Detecting 94% syllabus retention in Cyber-Ethics. Scaling complexity to prevent engagement decay."
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 mb-2">
                                    <span>System Intervention</span>
                                    <span className="text-[#1ED760]">ACTIVE</span>
                                </div>
                                <p className="text-xs text-gray-500">Auto-generated specialized quiz for 14 students below threshold.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pop-up Panel Overlay */}
            <AnimatePresence>
                {activePanel && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActivePanel(null)}
                            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl"
                        />
                        <motion.div
                            layoutId={activePanel}
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            className="fixed top-0 right-0 z-[110] w-[500px] h-screen glass-panel border-l-2 border-[#1ED760] p-12 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
                        >
                            <button
                                onClick={() => setActivePanel(null)}
                                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="mt-12">
                                {panels[activePanel]}
                            </div>

                            {/* Decorative Footer */}
                            <div className="absolute bottom-12 left-12 right-12">
                                <div className="h-[1px] bg-white/10 mb-6" />
                                <div className="flex justify-between items-center opacity-30">
                                    <span className="text-[10px] tracking-widest uppercase">Encryption Mode: active</span>
                                    <Cpu size={20} />
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow linear infinite;
        }
      `}</style>
        </div>
    );
}
