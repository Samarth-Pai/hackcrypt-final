'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const STONES = [
    { id: 'math', name: 'MATHEMATICS', color: '#fbbf24', image: '/assets/cosmic/stone-algo.png' }, // Yellow
    { id: 'chem', name: 'CHEMISTRY', color: '#f472b6', image: '/assets/cosmic/stone-data.png' }, // Pink
    { id: 'cs', name: 'CS FUNDAMENTALS', color: '#00F3FF', image: '/assets/cosmic/stone-ai.png', isCenter: true }, // Cyan
    { id: 'bio', name: 'BIOLOGY', color: '#22c55e', image: '/assets/cosmic/stone-networks.png' }, // Green
    { id: 'phys', name: 'PHYSICS', color: '#a855f7', image: '/assets/cosmic/stone-security.png' }, // Purple
];

export default function InfinityStoneNav() {
    return (
        <div className="w-full relative py-8 px-4 flex justify-center">
            <div className="flex flex-wrap justify-center items-end gap-6 md:gap-10 relative z-10">
                {STONES.map((stone, index) => {
                    const isCenter = stone.isCenter;
                    return (
                        <motion.div
                            key={stone.id}
                            className={`relative group flex flex-col items-center gap-4 ${isCenter ? '-mt-4' : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Stone Container - Transparent Wrapper for Sizing/Glow */}
                            <motion.div
                                className={`relative flex items-center justify-center transition-all duration-500
                                    ${isCenter ? 'w-32 h-32 md:w-40 md:h-40' : 'w-24 h-24 md:w-28 md:h-28'}
                                `}
                                whileHover={{
                                    scale: 1.05
                                }}
                            >
                                {/* Inner Glow (Ambient Light behind stone, no borders) */}
                                <div
                                    className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full blur-xl"
                                    style={{
                                        background: `radial-gradient(circle at center, ${stone.color} 0%, transparent 70%)`
                                    }}
                                />

                                {/* Stone Image */}
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    className={`relative z-10 ${isCenter ? 'w-24 h-24 md:w-32 md:h-32' : 'w-16 h-16 md:w-20 md:h-20'}`}
                                >
                                    <Image
                                        src={stone.image}
                                        alt={stone.name}
                                        fill
                                        className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] mix-blend-screen"
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Static Clean Label */}
                            <div className="text-center">
                                <h3
                                    className={`font-black uppercase tracking-widest ${isCenter ? 'text-sm md:text-base' : 'text-[10px] md:text-xs'}`}
                                    style={{ color: stone.color }}
                                >
                                    {stone.name}
                                </h3>
                                {isCenter && (
                                    <div className="h-0.5 w-12 mx-auto mt-1 rounded-full" style={{ backgroundColor: stone.color }} />
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Background Decorative Line */}
            <div className="absolute bottom-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10" />
        </div>
    );
}
