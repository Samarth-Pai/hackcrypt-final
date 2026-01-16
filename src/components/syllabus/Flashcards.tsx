'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type Flashcard = {
    title: string;
    content: string;
};

export default function Flashcards({ cards }: { cards: Flashcard[] }) {
    const [index, setIndex] = useState(0);
    const card = cards[index];

    return (
        <div className="glass-cosmic p-6 rounded-xl border border-cyan-500/30">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-cyan-200">Flashcards</h3>
                <span className="text-xs text-slate-400">{index + 1} / {cards.length}</span>
            </div>
            <div className="bg-[#140A28]/80 border border-cyan-500/30 rounded-xl p-6 min-h-35">
                <p className="text-sm text-violet-300 font-semibold mb-2">{card.title}</p>
                <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">{card.content}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <button
                    onClick={() => setIndex((prev) => (prev - 1 + cards.length) % cards.length)}
                    className="px-3 py-2 bg-[#140A28] border border-cyan-500/30 rounded-lg text-slate-300 hover:text-white hover:border-violet-500/60 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setIndex((prev) => (prev + 1) % cards.length)}
                    className="px-3 py-2 bg-[#140A28] border border-cyan-500/30 rounded-lg text-slate-300 hover:text-white hover:border-violet-500/60 transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
