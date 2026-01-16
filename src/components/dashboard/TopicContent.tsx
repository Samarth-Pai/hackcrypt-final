'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, BookOpen, Hash, ArrowRight } from 'lucide-react';

export interface TopicSection {
    title: string;
    content: string[]; // Array of short sentences/bullets
}

export interface TopicData {
    id: string;
    title: string;
    description: string;
    sections: TopicSection[];
    status: 'locked' | 'in_progress' | 'completed';
}

interface TopicContentProps {
    topic: TopicData;
    onClose: () => void;
}

const TopicContent = ({ topic, onClose }: TopicContentProps) => {
    return (
        <div className="bg-slate-950/90 w-full max-w-2xl max-h-[80vh] flex flex-col rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-start bg-slate-900/50">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={16} className="text-cyan-400" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold">
                            Educational Module
                        </span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight">
                        {topic.title}
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                <p className="text-sm text-slate-400 italic border-l-2 border-cyan-500/30 pl-4 py-1">
                    {topic.description}
                </p>

                <div className="space-y-6">
                    {topic.sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-slate-900/40 rounded-xl p-5 border border-white/5"
                        >
                            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                                <span className="text-cyan-500/50">0{idx + 1}.</span>
                                {section.title}
                            </h3>
                            <ul className="space-y-2.5">
                                {section.content.map((point, pIdx) => (
                                    <li key={pIdx} className="flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
                                        <ArrowRight size={12} className="mt-0.5 text-cyan-500 shrink-0" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-slate-900/30">
                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-widest text-xs transition-colors shadow-lg shadow-cyan-900/20"
                >
                    Complete Module Review
                </button>
            </div>
        </div>
    );
};

export default TopicContent;
