'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, BookOpen, CheckCircle, ChevronRight } from 'lucide-react';
import CosmicCard from '@/components/cosmic/CosmicCard';

export type SyllabusStatus = 'locked' | 'in_progress' | 'completed';

interface SyllabusCardProps {
    id: string;
    title: string;
    description: string;
    status: SyllabusStatus;
    onClick: (id: string) => void;
    delay?: number;
}

const SyllabusCard = ({ id, title, description, status, onClick, delay = 0 }: SyllabusCardProps) => {
    const isLocked = status === 'locked';

    const getStatusIcon = () => {
        switch (status) {
            case 'locked':
                return <Lock size={16} className="text-slate-500" />;
            case 'completed':
                return <CheckCircle size={16} className="text-emerald-400" />;
            case 'in_progress':
                return <BookOpen size={16} className="text-cyan-400 animate-pulse" />;
            default:
                return null;
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'locked': return 'LOCKED';
            case 'completed': return 'COMPLETED';
            case 'in_progress': return 'IN PROGRESS';
            default: return '';
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'locked': return 'slate';
            case 'completed': return 'emerald';
            case 'in_progress': return 'cyan';
            default: return 'slate';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            onClick={() => !isLocked && onClick(id)}
            className={`group relative ${isLocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
        >
            <CosmicCard
                glow={status === 'in_progress' ? 'blue' : status === 'completed' ? 'cyan' : undefined}
                className="h-full flex flex-col justify-between transition-all duration-300 group-hover:-translate-y-1"
            >
                <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`
                            px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border
                            ${status === 'in_progress' ? 'bg-cyan-950/50 text-cyan-400 border-cyan-500/30' :
                                status === 'completed' ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30' :
                                    'bg-slate-900/50 text-slate-500 border-slate-700/50'}
                        `}>
                            <div className="flex items-center gap-1.5">
                                {getStatusIcon()}
                                <span>{getStatusText()}</span>
                            </div>
                        </div>
                    </div>

                    <h3 className={`text-lg font-bold mb-2 ${isLocked ? 'text-slate-500' : 'text-slate-100 group-hover:text-cyan-300 transition-colors'}`}>
                        {title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {description}
                    </p>
                </div>

                {!isLocked && (
                    <div className="px-5 py-3 border-t border-white/5 flex justify-between items-center group-hover:bg-white/5 transition-colors">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            View Module
                        </span>
                        <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                )}
            </CosmicCard>
        </motion.div>
    );
};

export default SyllabusCard;
