'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, Sparkles } from 'lucide-react';

interface SyllabusCardProps {
    title: string;
    description: string;
    status: 'locked' | 'active' | 'completed';
    onClick?: () => void;
    index: number;
}

const SyllabusCard: React.FC<SyllabusCardProps> = ({
    title,
    description,
    status,
    onClick,
    index
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full"
        >
            <button
                onClick={status !== 'locked' ? onClick : undefined}
                disabled={status === 'locked'}
                className={`
                    w-full text-left p-6 rounded-xl border relative overflow-hidden transition-all duration-300
                    ${status === 'active'
                        ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:scale-[1.02]'
                        : status === 'completed'
                            ? 'bg-emerald-500/5 border-emerald-500/30 opacity-80 hover:opacity-100'
                            : 'bg-slate-900/40 border-slate-800 opacity-60 cursor-not-allowed'
                    }
                `}
            >
                {/* Active Indicator */}
                {status === 'active' && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                )}

                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className={`font-bold text-lg tracking-tight ${status === 'active' ? 'text-cyan-300' : status === 'completed' ? 'text-emerald-300' : 'text-slate-500'}`}>
                                {title}
                            </h3>
                            {status === 'active' && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 uppercase tracking-widest border border-cyan-500/30">
                                    Current
                                </span>
                            )}
                        </div>
                        <p className={`text-sm ${status === 'locked' ? 'text-slate-600' : 'text-slate-400'}`}>
                            {description}
                        </p>
                    </div>

                    {/* Status Icon */}
                    <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center border
                        ${status === 'active'
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : status === 'completed'
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                                : 'bg-slate-800 border-slate-700 text-slate-600'
                        }
                    `}>
                        {status === 'locked' && <Lock size={18} />}
                        {status === 'active' && <Sparkles size={18} className="animate-pulse" />}
                        {status === 'completed' && <Check size={18} />}
                    </div>
                </div>
            </button>
        </motion.div>
    );
};

export default SyllabusCard;
