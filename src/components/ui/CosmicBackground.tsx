'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const backgrounds = [
    '/assets/cosmic/bg-1.png',
    '/assets/cosmic/bg-2.png',
    '/assets/cosmic/bg-3.png',
];

export default function CosmicBackground() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % backgrounds.length);
        }, 15000); // Cycle every 15 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-slate-950">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 3, ease: 'easeInOut' }}
                    className="absolute inset-0 w-full h-full"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-linear transform scale-100"
                        style={{ backgroundImage: `url(${backgrounds[index]})` }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Overlays for readability and vibrancy */}
            <div className="absolute inset-0 bg-[#0B0014]/70" /> {/* Dark Violet Tint */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0014] via-transparent to-[#0B0014]/40" />

            {/* Vibrant Nebula Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[100px] rounded-full mix-blend-screen animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[100px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,0,20,0.8)_100%)]" />
        </div>
    );
}
