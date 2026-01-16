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
        <div className="bg-[#5D4037]/40 p-6 rounded-xl border border-[#5D4037]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-growth">Flashcards</h3>
                <span className="text-xs text-gray-400">{index + 1} / {cards.length}</span>
            </div>
            <div className="bg-earth/80 border border-[#5D4037] rounded-xl p-6 min-h-[140px]">
                <p className="text-sm text-sun font-semibold mb-2">{card.title}</p>
                <p className="text-sm text-gray-200">{card.content}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <button
                    onClick={() => setIndex((prev) => (prev - 1 + cards.length) % cards.length)}
                    className="px-3 py-2 bg-[#3E2723] border border-[#5D4037] rounded-lg text-gray-300 hover:text-white"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setIndex((prev) => (prev + 1) % cards.length)}
                    className="px-3 py-2 bg-[#3E2723] border border-[#5D4037] rounded-lg text-gray-300 hover:text-white"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
