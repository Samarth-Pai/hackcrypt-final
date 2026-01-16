'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

interface ContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    title: string;
    content: string[]; // Array of strings for "chunks"
}

const ContentModal: React.FC<ContentModalProps> = ({
    isOpen,
    onClose,
    onComplete,
    title,
    content
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl pointer-events-auto flex flex-col max-h-[80vh]">

                            {/* Header */}
                            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content - Scrollable */}
                            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 leading-relaxed custom-scrollbar">
                                {content.map((chunk, i) => (
                                    <motion.p
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + (i * 0.1) }}
                                        className="text-base"
                                    >
                                        {chunk}
                                    </motion.p>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                                <button
                                    onClick={onComplete}
                                    className="w-full py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] transition-all flex items-center justify-center gap-2"
                                >
                                    <Check size={20} />
                                    Complete & Continue
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ContentModal;
