'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu,
    Zap,
    Target,
    Trophy,
    Activity,
    Shield,
    TrendingUp,
    ChevronRight,
    Info,
    X,
    Lock,
    MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

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
        <div className="relative p-5 rounded-2xl glass-v2 border-2 border-transparent group-hover:border-white/20 transition-all duration-500 shadow-2xl"
            style={{ boxShadow: `0 0 20px ${color}20` }}>
            <div style={{ color }} className="mb-2">{icon}</div>
            <div className="space-y-0.5">
                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-black">{label}</p>
                <p className="text-sm font-black text-white">{value}</p>
            </div>

            {/* Connector line to center (visual only) */}
            <div className="absolute top-1/2 left-1/2 w-[100px] h-[1px] bg-gradient-to-r from-transparent to-white/5 -z-10 origin-left -translate-x-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    </motion.div>
);

export default function MissionControl({ user }: { user: any }) {
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [quests, setQuests] = useState<Array<{ id: string; title: string; description: string; progress: number; target: number; rewardXp: number }>>([]);
    const xp = user?.gamification?.xp || 0;
    const level = user?.gamification?.level || 1;
    const accuracy = user?.performance?.totalQuestions > 0
        ? (user?.performance?.totalCorrect / user?.performance?.totalQuestions) * 100
        : 0;

    const orbs = [
        { id: 'accuracy', icon: <Target size={24} />, label: 'Tactical_Precision', value: `${Math.round(accuracy)}%`, color: '#1ED760', x: 15, y: 20, delay: 0 },
        { id: 'streak', icon: <Zap size={24} />, label: 'Momentum_Chain', value: `${user?.gamification?.streak?.count || 0} Days`, color: '#FFFFFF', x: 75, y: 15, delay: 2 },
        { id: 'xp', icon: <Activity size={24} />, label: 'Neural_Load', value: `${xp} XP`, color: '#1ED760', x: 20, y: 70, delay: 4 },
        { id: 'rank', icon: <Trophy size={24} />, label: 'Elite_Standing', value: '#12 Rank', color: '#FFFFFF', x: 80, y: 65, delay: 6 },
    ];

    const panels: Record<string, React.ReactNode> = {
        accuracy: (
            <div className="space-y-6">
                <h3 className="text-2xl font-black text-purple-ai neon-text-ai uppercase tracking-tighter">Diagnostic Analytics</h3>
                <div className="grid grid-cols-1 gap-4">
                    {[
                        { label: 'Analytical Speed', val: '84ms', color: '#1ED760' },
                        { label: 'Retention Flow', val: '92%', color: '#FFFFFF' },
                        { label: 'Error Margin', val: '4%', color: '#FF5252' }
                    ].map(stat => (
                        <div key={stat.label} className="p-4 rounded-xl glass-v2 border border-white/5 flex justify-between items-center group hover:border-purple-ai/30 transition-all">
                            <span className="text-xs uppercase tracking-widest text-gray-400">{stat.label}</span>
                            <span className="font-mono font-black text-white" style={{ color: stat.color }}>{stat.val}</span>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-purple-ai/5 border border-purple-ai/10 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-purple-ai mb-2 flex items-center gap-2">
                        <Info size={14} /> AI Recommendation
                    </p>
                    <p className="text-xs text-gray-400 italic leading-relaxed">
                        "Pattern detection suggests high mastery in Logic Gates. Recommend transitioning to Cryptography Phase 2."
                    </p>
                </div>
            </div>
        ),
        xp: (
            <div className="space-y-6">
                <h3 className="text-2xl font-black text-green-neon neon-text-ai uppercase tracking-tighter">Experience Matrix</h3>
                <div className="relative h-48 w-full glass-v2 rounded-2xl overflow-hidden border border-white/5 p-6 font-mono">
                    <div className="flex justify-between items-end h-full gap-2">
                        {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    className="w-full bg-gradient-to-t from-green-neon/20 to-green-neon rounded-t-sm"
                                />
                                <span className="text-[8px] text-gray-500">D{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="w-full py-4 rounded-xl bg-green-neon text-teal-bg font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform">
                    Claim Weekly Surplus: +250 XP
                </button>
            </div>
        )
    };

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
        <div className="relative w-full h-[800px] flex items-center justify-center select-none">

            {/* Background Orbital Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <div className="w-[400px] h-[400px] border border-purple-ai rounded-full animate-pulse" />
                <div className="absolute w-[600px] h-[600px] border border-white/10 rounded-full border-dashed animate-spin-slow" />
                <div className="absolute w-[800px] h-[800px] border border-purple-ai/20 rounded-full animate-reverse-spin" />
            </div>

            {/* Main AI Neural Core */}
            <div className="relative z-40 group">
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-72 h-72 rounded-full glass-v2-glow flex flex-col items-center justify-center relative overflow-hidden group-hover:shadow-[0_0_80px_rgba(168,85,247,0.3)] transition-all duration-700"
                >
                    <div className="absolute inset-0 neural-bg group-hover:scale-150 transition-transform duration-1000" />
                    <Cpu size={64} className="text-purple-ai mb-4 neon-text-ai animate-pulse" />
                    <div className="text-center relative z-10">
                        <p className="text-[10px] uppercase tracking-[0.5em] text-gray-500 font-black mb-1">Neural_Core</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black text-white italic tracking-tighter">LVL_{level}</span>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-1.5 h-4 items-end">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ height: [4, 16, 4] }}
                                transition={{ duration: 0.6 + i * 0.1, repeat: Infinity }}
                                className="w-1 bg-purple-ai/50 rounded-full"
                            />
                        ))}
                    </div>

                    {/* Scanline Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-ai/10 to-transparent h-1 w-full animate-scanline pointer-events-none" />
                </motion.div>

                {/* Core Info Tooltip */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap">
                    <div className="glass-v2 px-4 py-2 rounded-lg border border-purple-ai/30 text-[10px] uppercase tracking-widest font-bold text-purple-ai">
                        System Status: Optimal | Sync Rate: 98.4%
                    </div>
                </div>
            </div>

            {/* Tactical Orbs */}
            {orbs.map(orb => (
                <TacticalOrb key={orb.id} {...orb} onClick={setActiveTab} />
            ))}

            {/* Floating Mission Center Brief (Right) */}
            <div className="absolute right-10 bottom-10 w-96 z-40">
                <div className="glass-v2 p-6 rounded-3xl border-l-4 border-purple-ai relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Shield size={100} className="text-purple-ai" />
                    </div>
                    <h3 className="text-xs uppercase tracking-[0.3em] text-purple-ai font-black mb-6 flex items-center gap-2">
                        <Activity size={16} /> Active_Mission
                    </h3>
                    <div className="space-y-4">
                        {quests.length === 0 && (
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-400">
                                Missions syncing...
                            </div>
                        )}
                        {quests.map((quest) => {
                            const progressPct = Math.min(100, Math.round((quest.progress / quest.target) * 100));
                            return (
                                <div key={quest.id} className="p-4 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-1">{quest.title}</h4>
                                            <p className="text-[10px] text-gray-500 font-bold">REWARD: +{quest.rewardXp} XP</p>
                                            <p className="text-[10px] text-gray-500">{quest.description}</p>
                                        </div>
                                        <div className="px-2 py-1 rounded bg-purple-ai text-white text-[9px] font-black">{progressPct}% COM</div>
                                    </div>
                                    <div className="w-full h-1 bg-teal-bg rounded-full overflow-hidden mt-3">
                                        <div className="h-full bg-purple-ai" style={{ width: `${progressPct}%` }} />
                                    </div>
                                    <div className="mt-2 text-[10px] text-gray-400">{quest.progress} / {quest.target}</div>
                                </div>
                            );
                        })}
                    </div>
                    <Link href="/quiz" className="mt-8 w-full py-4 rounded-xl bg-white text-teal-bg font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-purple-ai hover:text-white transition-all">
                        Start Quest <ChevronRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Side HUD: Live Feed (Left) */}
            <div className="absolute left-10 bottom-10 w-72 z-40">
                <div className="glass-v2 p-6 rounded-3xl border border-white/5">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black mb-6 flex items-center gap-2">
                        <MessageSquare size={14} /> Neural_Sync_Feed
                    </h3>
                    <div className="space-y-4 h-48 overflow-y-auto no-scrollbar">
                        {[
                            { msg: 'Badge "Cipher King" Unlocked', sub: 'Achievement synchronization complete', color: '#FFFFFF' },
                            { msg: 'Global Shift: Tier 3 Battle', sub: 'Matchmaking sequence initiated', color: '#1ED760' },
                            { msg: 'Daily Log Sequence Validated', sub: '+1 Momentum Chain verified', color: '#FFFFFF' }
                        ].map((idx, i) => (
                            <div key={i} className="relative pl-3 border-l-2 border-white/5 py-1">
                                <p className="text-[10px] font-bold text-white mb-0.5">{idx.msg}</p>
                                <p className="text-[8px] uppercase tracking-wider text-gray-500">{idx.sub}</p>
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
                            className="fixed inset-0 z-[100] bg-teal-bg/90 backdrop-blur-xl"
                        />
                        <motion.div
                            layoutId={activeTab}
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none"
                        >
                            <div className="w-full max-w-xl glass-v2 p-12 rounded-[40px] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] pointer-events-auto relative">
                                <button
                                    onClick={() => setActiveTab(null)}
                                    className="absolute top-10 right-10 text-gray-500 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                                {panels[activeTab] || (
                                    <div className="text-center py-10">
                                        <Lock size={48} className="text-gray-700 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Module Encrypted</h3>
                                        <p className="text-xs text-gray-500 max-w-xs mx-auto uppercase tracking-wider leading-relaxed">
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

            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow { animation: spin-slow 60s linear infinite; }
        .animate-reverse-spin { animation: reverse-spin 45s linear infinite; }
      `}</style>
        </div>
    );
}
