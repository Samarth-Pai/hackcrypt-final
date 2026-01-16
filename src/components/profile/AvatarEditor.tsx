import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RefreshCw, Sparkles, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import MarvelAvatar, { HeroType, AvatarColors, DEFAULT_AVATAR_COLORS } from './MarvelAvatar';
import Image from 'next/image';

interface AvatarEditorProps {
    initialHero?: HeroType;
    initialColors?: AvatarColors;
    initialImage?: string;
    onSave: (config: { type: 'custom' | 'classic', hero?: HeroType, colors?: AvatarColors, imageUrl?: string }) => void;
    onClose: () => void;
}

const CLASSIC_AVATARS = [
    { id: 'strategist', name: 'Strategic Prime', src: '/assets/avatars/rivals-strategist.png' },
    { id: 'tech', name: 'Techno-Lord', src: '/assets/avatars/rivals-tech.png' },
    { id: 'mystic', name: 'Mystic Arts', src: '/assets/avatars/rivals-mystic.png' },
    { id: 'stealth', name: 'Shadow Striker', src: '/assets/avatars/rivals-stealth.png' },
];

export default function AvatarEditor({ initialHero = 'tech', initialColors, initialImage, onSave, onClose }: AvatarEditorProps) {
    // Classic Mode State - Default to first if none selected
    const [selectedClassic, setSelectedClassic] = useState<string>(initialImage || CLASSIC_AVATARS[0].src);

    const handleSave = () => {
        onSave({ type: 'classic', imageUrl: selectedClassic });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-red-500" />
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">AVATAR SELECTION</span>
                    </h2>
                </div>

                <div className="flex flex-col items-center justify-center min-h-[400px] w-full relative perspective-1000">
                    <div className="relative w-full h-[300px] flex items-center justify-center perspective-[1000px]">
                        <AnimatePresence mode="popLayout">
                            {CLASSIC_AVATARS.map((avatar, index) => {
                                const currentIndex = CLASSIC_AVATARS.findIndex(a => a.src === selectedClassic);
                                let offset = index - currentIndex;

                                // Handle cyclic wrap-around for smoother feel (optional, but good for spinning)
                                // effective offset limited for visuals
                                if (offset < -2) offset = -2;
                                if (offset > 2) offset = 2;

                                const isActive = avatar.src === selectedClassic;

                                return (
                                    <motion.button
                                        key={avatar.id}
                                        onClick={() => setSelectedClassic(avatar.src)}
                                        initial={false}
                                        animate={{
                                            x: offset * 180, // Horizontal spacing
                                            scale: isActive ? 1.4 : 0.8,
                                            rotateY: isActive ? 0 : offset * 25, // Rotate towards center
                                            opacity: isActive ? 1 : 0.4,
                                            zIndex: isActive ? 10 : 10 - Math.abs(offset),
                                            filter: isActive ? 'blur(0px)' : 'blur(2px)',
                                        }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                        className={`absolute w-44 h-44 rounded-2xl overflow-hidden border-2 shadow-2xl transition-colors duration-300
                                            ${isActive ? 'border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.6)]' : 'border-white/20 bg-black/50'}
                                        `}
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                                        <Image src={avatar.src} alt={avatar.name} fill className="object-cover" />

                                        <div className="absolute bottom-4 left-0 right-0 z-20 text-center">
                                            <p className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 inline-block rounded-full backdrop-blur-md
                                                ${isActive ? 'bg-yellow-400 text-black' : 'bg-black/50 text-white'}
                                            `}>
                                                {avatar.name}
                                            </p>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
                        <button
                            className="pointer-events-auto p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                            onClick={() => {
                                const currIdx = CLASSIC_AVATARS.findIndex(a => a.src === selectedClassic);
                                const prevIdx = (currIdx - 1 + CLASSIC_AVATARS.length) % CLASSIC_AVATARS.length;
                                setSelectedClassic(CLASSIC_AVATARS[prevIdx].src);
                            }}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            className="pointer-events-auto p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                            onClick={() => {
                                const currIdx = CLASSIC_AVATARS.findIndex(a => a.src === selectedClassic);
                                const nextIdx = (currIdx + 1) % CLASSIC_AVATARS.length;
                                setSelectedClassic(CLASSIC_AVATARS[nextIdx].src);
                            }}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <div className="mt-8 p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/20 text-yellow-200 text-xs text-center max-w-sm">
                        <p className="font-bold mb-1 flex items-center justify-center gap-2"><Sparkles size={12} /> RIVALS ELITE COLLECTION</p>
                        Spin the carousel to select your hero.
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8 pt-4 border-t border-white/5">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-bold flex items-center justify-center gap-2"
                    >
                        <X size={18} /> Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                    >
                        <Check size={18} /> Deploy Updates
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
