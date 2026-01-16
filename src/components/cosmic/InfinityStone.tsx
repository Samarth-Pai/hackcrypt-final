'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import Image from 'next/image';

interface InfinityStoneProps {
    label: string;
    imageSrc: string;
    color: string;
    locked?: boolean;
    onClick?: () => void;
    delay?: number;
}

const InfinityStone: React.FC<InfinityStoneProps> = ({
    label,
    imageSrc,
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
                        y: [-5, 5, -5],
                        filter: [
                            `drop-shadow(0 0 10px ${color}40)`,
                            `drop-shadow(0 0 25px ${color}60)`,
                            `drop-shadow(0 0 10px ${color}40)`,
                        ]
                    } : {}}
                    transition={{
                        duration: 4,
                        repeat: 999999, // Effectively infinite
                        ease: "easeInOut"
                    }}
                    className={`
                        w-48 h-48 md:w-56 md:h-56
                        flex items-center justify-center
                        transition-all duration-500
                        relative
                        ${locked ? 'grayscale brightness-75 opacity-90' : 'hover:scale-110'}
                    `}
                >
                    <Image
                        src={imageSrc}
                        alt={label}
                        width={256}
                        height={256}
                        className={`object-contain w-full h-full drop-shadow-2xl transition-all duration-300 mix-blend-screen ${!locked ? 'group-hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]' : ''}`}
                        style={{
                            filter: !locked ? `drop-shadow(0 0 15px ${color})` : undefined
                        }}
                    />

                    {locked && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <Lock className="text-slate-400/80 drop-shadow-lg" size={48} />
                        </div>
                    )}
                </motion.div>

                {/* Glow behind */}
                {!locked && (
                    <div
                        className="absolute inset-0 -z-10 blur-[50px] opacity-20 transition-all duration-500 group-hover:opacity-50"
                        style={{ background: color }}
                    />
                )}
            </div>

            <div className="text-center space-y-1 relative z-10">
                <h3 className={`font-mono text-sm tracking-[0.2em] uppercase font-bold transition-all duration-300 ${locked ? 'text-slate-500' : 'text-slate-100 group-hover:text-cyan-300 group-hover:shadow-[0_0_20px_currentColor]'}`}
                    style={{ textShadow: !locked ? `0 0 10px ${color}` : 'none' }}
                >
                    {label}
                </h3>
            </div>
        </motion.div>
    );
};

export default InfinityStone;
