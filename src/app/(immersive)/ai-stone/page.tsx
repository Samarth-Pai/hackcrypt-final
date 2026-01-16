'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Terminal, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import GuardianChat from '@/components/immersive/GuardianChat';

export default function AIStonePage() {
    const [energyLevel, setEnergyLevel] = useState(0);
    const [showGuardian, setShowGuardian] = useState(false);

    // Simulate energy level loading
    useEffect(() => {
        const timer = setTimeout(() => setEnergyLevel(35), 500);
        return () => clearTimeout(timer);
    }, []);

    const sections = [
        {
            id: 'learn',
            title: 'LEARN',
            icon: Brain,
            description: 'Absorb the core concepts of Computer Science.',
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/30',
            hover: 'hover:border-cyan-400 hover:bg-cyan-500/20'
        },
        {
            id: 'practice',
            title: 'PRACTICE',
            icon: Terminal,
            description: 'Apply your knowledge in the simulation chamber.',
            color: 'text-violet-400',
            bg: 'bg-violet-500/10',
            border: 'border-violet-500/30',
            hover: 'hover:border-violet-400 hover:bg-violet-500/20'
        },
        {
            id: 'guardian',
            title: 'ASK THE GUARDIAN',
            icon: Shield,
            description: 'Consult the AI Guardian for guidance and wisdom.',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/30',
            hover: 'hover:border-emerald-400 hover:bg-emerald-500/20'
        }
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Glow based on Energy */}
            <div
                className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
                style={{
                    opacity: 0.1 + (energyLevel / 200),
                    background: `radial-gradient(circle at center, #06b6d4 0%, transparent 70%)`
                }}
            />

            {/* Back Navigation (Subtle) */}
            <Link
                href="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-widest">Exit Stone</span>
            </Link>

            {/* Main Interface */}
            <div className="w-full max-w-4xl z-10 space-y-12">

                {/* Header */}
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2">
                            CS FUNDAMENTALS
                        </h1>
                        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                    </motion.div>

                    {/* Energy Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-md mx-auto"
                    >
                        <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-400 mb-2 font-bold">
                            <span>Synaptic Energy</span>
                            <span>{energyLevel}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-900 rounded-full border border-slate-800 overflow-hidden relative">
                            {/* Grid lines in background of bar */}
                            <div className="absolute inset-0 flex">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="flex-1 border-r border-slate-800/50" />
                                ))}
                            </div>
                            <motion.div
                                className="h-full bg-cyan-500 relative"
                                initial={{ width: 0 }}
                                animate={{ width: `${energyLevel}%` }}
                                transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {sections.map((section, index) => (
                        <motion.button
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + (index * 0.1) }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                if (section.id === 'guardian') {
                                    setShowGuardian(true);
                                }
                            }}
                            className={`
                                group relative text-left p-8 rounded-2xl border transition-all duration-300
                                ${section.bg} ${section.border} ${section.hover}
                                backdrop-blur-sm
                            `}
                        >
                            <div className={`mb-6 p-4 rounded-xl bg-slate-950/50 w-fit border border-white/5 group-hover:scale-110 transition-transform duration-300 ${section.color}`}>
                                <section.icon size={32} />
                            </div>

                            <h3 className="text-xl font-bold text-slate-100 mb-3 tracking-tight group-hover:text-white transition-colors">
                                {section.title}
                            </h3>

                            <p className="text-sm text-slate-400 leading-relaxed font-light group-hover:text-slate-300 transition-colors">
                                {section.description}
                            </p>

                            {/* Corner Accents */}
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className={`w-2 h-2 rounded-full ${section.color.replace('text-', 'bg-')}`} />
                            </div>
                        </motion.button>
                    ))}
                </div>

            </div>

            <AnimatePresence>
                {showGuardian && <GuardianChat onClose={() => setShowGuardian(false)} />}
            </AnimatePresence>
        </div>
    );
}
