'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface InfinityStoneProps {
    label: string;
    color: string;
    locked?: boolean;
    onClick?: () => void;
    delay?: number;
}

const InfinityStone: React.FC<InfinityStoneProps> = ({
    label,
    color,
    locked = false,
    onClick,
    delay = 0
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.8, ease: "easeOut" }}
            className="relative flex flex-col items-center gap-4 group cursor-pointer"
            onClick={!locked ? onClick : undefined}
        >
            <div className="relative">
                <motion.div
                    animate={!locked ? {
                        boxShadow: [
                            `0 0 20px ${color}40`,
                            `0 0 60px ${color}80`,
                            `0 0 20px ${color}40`,
                        ],
                        scale: [1, 1.05, 1],
                    } : {}}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className={`
            w-32 h-48 md:w-40 md:h-56 
            clip-path-crystal backdrop-blur-[12px]
            flex items-center justify-center
            transition-all duration-500
            ${locked ? 'bg-slate-900/40 grayscale brightness-50' : 'bg-gradient-to-br from-white/10 to-transparent'}
          `}
                    style={{
                        border: `1px solid ${locked ? '#334155' : color}`,
                        background: locked ? undefined : `linear-gradient(135deg, ${color}20 0%, transparent 100%)`
                    }}
                >
                    {locked ? (
                        <Lock className="text-slate-600" size={32} />
                    ) : (
                        <div className="w-full h-full relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-30 animate-scanline" />
                        </div>
                    )}
                </motion.div>

                {/* Glow behind */}
                {!locked && (
                    <div
                        className="absolute inset-0 -z-10 blur-[40px] opacity-40 transition-all duration-500 group-hover:opacity-60"
                        style={{ background: color }}
                    />
                )}
            </div>

            <div className="text-center space-y-1">
                <h3 className={`font-mono text-sm tracking-[0.2em] uppercase font-bold transition-colors ${locked ? 'text-slate-600' : 'text-slate-100 group-hover:text-white'}`}>
                    {label}
                </h3>
                {locked && (
                    <p className="text-[10px] text-slate-700 uppercase tracking-widest">Locked</p>
                )}
            </div>

            <style jsx>{`
        .clip-path-crystal {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>
        </motion.div>
    );
};

export default InfinityStone;
