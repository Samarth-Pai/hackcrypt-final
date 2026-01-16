
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface BadgeUnlockProps {
    badgeName: string;
    description: string;
    icon?: React.ReactNode;
}

export default function BadgeUnlock({ badgeName, description, icon }: BadgeUnlockProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (isVisible) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#C6FF00', '#2E7D32', '#FFD600']
            });
        }
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 15, stiffness: 300 }}
                        className="relative w-full max-w-md bg-teal-muted border-2 border-purple-ai rounded-3xl p-8 shadow-[0_0_50px_rgba(30,215,96,0.3)] overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-ai/20 rounded-full blur-[80px]"></div>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="relative z-10 text-center">
                            <motion.div
                                initial={{ rotate: -10, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl"
                            >
                                {icon || <Trophy className="w-12 h-12 text-teal-bg" />}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="flex justify-center gap-1 mb-2">
                                    {[...Array(3)].map((_, i) => (
                                        <Star key={i} className="text-purple-ai fill-purple-ai w-4 h-4" />
                                    ))}
                                </div>
                                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">Achievement Unlocked!</h2>
                                <h3 className="text-xl font-bold text-purple-ai mb-4">{badgeName}</h3>
                                <p className="text-gray-400 mb-6 leading-relaxed">{description}</p>

                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="w-full py-4 bg-purple-ai text-teal-bg font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg uppercase tracking-wider"
                                >
                                    Continue Journey
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
