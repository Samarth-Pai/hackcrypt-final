'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Radio, Trophy, Hexagon, ChevronRight, ShieldAlert } from 'lucide-react';

export type SyllabusStatus = 'locked' | 'in_progress' | 'completed';

interface SyllabusCardProps {
    id: string;
    title: string;
    description: string;
    status: SyllabusStatus;
    onClick: (id: string) => void;
    delay: number;
}

const SyllabusCard: React.FC<SyllabusCardProps> = ({
    id,
    title,
    description,
    status,
    onClick,
    delay
}) => {
    const isLocked = status === 'locked';
    const isActive = status === 'in_progress';
    const isCompleted = status === 'completed';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="relative group h-full"
        >
            <button
                onClick={() => !isLocked && onClick(id)}
                disabled={isLocked}
                className={`
                    w-full h-full text-left relative overflow-hidden transition-all duration-300
                    flex flex-col
                    ${isActive
                        ? 'scale-105 z-10'
                        : isLocked ? 'opacity-70 grayscale' : 'hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]'}
                `}
            >
                {/* Tech Border Container */}
                <div className={`
                    absolute inset-0 border-2 clip-path-polygon bg-[#0a0a0a]/90 backdrop-blur-xl
                    ${isActive
                        ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                        : isCompleted
                            ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                            : 'border-slate-700/50'}
                `} style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}></div>

                {/* Animated Reactor Core (Active Only) */}
                {isActive && (
                    <div className="absolute top-4 right-4 w-24 h-24 opacity-20 pointer-events-none">
                        <div className="absolute inset-0 border-2 border-dashed border-cyan-400 rounded-full animate-[spin_10s_linear_infinite]" />
                        <div className="absolute inset-2 border border-dotted border-cyan-300 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
                    </div>
                )}

                {/* Content Layer */}
                <div className="relative z-10 p-6 flex flex-col h-full">
                    {/* Header: Icon & Badge */}
                    <div className="flex justify-between items-start mb-4">
                        <div className={`
                            p-3 rounded-lg border backdrop-blur-md relative overflow-hidden group-hover:shadow-[0_0_20px_currentColor] transition-all duration-500
                            ${isActive
                                ? 'bg-cyan-950/50 border-cyan-400 text-cyan-400'
                                : isCompleted
                                    ? 'bg-emerald-950/50 border-emerald-400 text-emerald-400'
                                    : 'bg-slate-900 border-slate-700 text-slate-500'}
                        `}>
                            {isActive && <Radio size={24} className="animate-pulse" />}
                            {isCompleted && <Trophy size={24} />}
                            {isLocked && <Lock size={24} />}

                            {/* Icon Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {isActive && (
                            <span className="px-2 py-1 text-[10px] font-bold text-cyan-950 bg-cyan-400 rounded clip-path-slant select-none animate-pulse">
                                ACTIVE MISSION
                            </span>
                        )}
                        {isCompleted && (
                            <span className="px-2 py-1 text-[10px] font-bold text-emerald-950 bg-emerald-400 rounded clip-path-slant select-none">
                                COMPLETED
                            </span>
                        )}
                        {isLocked && (
                            <span className="px-2 py-1 text-[10px] font-bold text-red-950 bg-red-500/70 rounded clip-path-slant select-none flex items-center gap-1">
                                <ShieldAlert size={10} /> CLASSIFIED
                            </span>
                        )}
                    </div>

                    {/* Title & Desc */}
                    <div className="space-y-2 mb-4 flex-1">
                        <h3 className={`text-lg font-black uppercase italic tracking-wider ${isActive ? 'text-white' : isLocked ? 'text-slate-500' : 'text-slate-300 group-hover:text-white'}`}>
                            {title}
                        </h3>
                        <p className={`text-xs font-mono leading-relaxed ${isLocked ? 'text-slate-600 blur-[2px] select-none' : 'text-slate-400'}`}>
                            {isLocked ? 'ACCESS DENIED. SECURITY CLEARANCE LEVEL 4 REQUIRED. COMPLETE PREVIOUS MODULES.' : description}
                        </p>
                    </div>

                    {/* Footer / Action */}
                    <div className={`mt-auto pt-4 border-t border-dashed ${isActive ? 'border-cyan-500/30' : 'border-white/5'} flex items-center justify-between`}>
                        <span className="text-[10px] font-mono text-slate-500">
                            ID: {id.split('-')[0].toUpperCase()}_{Math.floor(Math.random() * 999)}
                        </span>
                        {!isLocked && (
                            <div className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest transition-transform group-hover:translate-x-1 ${isActive ? 'text-cyan-400' : 'text-white'}`}>
                                {isCompleted ? 'Revisit' : 'Deploy'} <ChevronRight size={14} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Decorative Tech Lines */}
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-white/5 rounded-br-2xl pointer-events-none" />
            </button>
        </motion.div>
    );
};

export default SyllabusCard;
