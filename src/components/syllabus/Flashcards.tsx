'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type Flashcard = {
    title: string;
    content: string;
};

type ReviewSchedule = {
    interval: number;
    repetition: number;
    ease: number;
    due: string;
};

type ReviewRating = 'again' | 'good' | 'easy';

export default function Flashcards({ cards, syllabusSlug }: { cards: Flashcard[]; syllabusSlug?: string }) {
    const [index, setIndex] = useState(0);
    const [scheduleMap, setScheduleMap] = useState<Record<string, ReviewSchedule>>({});
    const [dueCount, setDueCount] = useState(0);
    const [saving, setSaving] = useState(false);
    const card = cards[index];

    if (!card) {
        return (
            <div className="glass-cosmic p-6 rounded-xl border border-cyan-500/30">
                <p className="text-sm text-slate-400">No flashcards available yet.</p>
            </div>
        );
    }

    const cardKey = useMemo(() => {
        const base = `${syllabusSlug || 'general'}::${index}-${card?.title || 'card'}`;
        return base.toLowerCase().replace(/\s+/g, '-');
    }, [syllabusSlug, index, card?.title]);

    const isDue = useMemo(() => {
        const schedule = scheduleMap[cardKey];
        if (!schedule?.due) return true;
        return new Date(schedule.due).getTime() <= Date.now();
    }, [scheduleMap, cardKey]);

    useEffect(() => {
        if (!syllabusSlug) return;
        const loadStatus = async () => {
            const response = await fetch(`/api/flashcards/status?syllabusSlug=${encodeURIComponent(syllabusSlug)}`);
            if (!response.ok) return;
            const data = await response.json();
            setScheduleMap(data.schedule || {});
            setDueCount(Number(data.dueCount || 0));
        };

        loadStatus();
    }, [syllabusSlug]);

    const submitReview = async (rating: ReviewRating) => {
        if (!syllabusSlug) return;
        setSaving(true);
        const response = await fetch('/api/flashcards/review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ syllabusSlug, cardKey, rating }),
        });
        if (response.ok) {
            const data = await response.json();
            setScheduleMap(data.schedule || {});
            setDueCount(Number(data.dueCount || 0));
        }
        setSaving(false);
    };

    return (
        <div className="glass-cosmic p-6 rounded-xl border border-cyan-500/30">
            <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-cyan-200">Flashcards</h3>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400">Due today: {dueCount}</p>
                </div>
                <span className="text-xs text-slate-400">{index + 1} / {cards.length}</span>
            </div>
            <div className={`bg-[#140A28]/80 border rounded-xl p-6 min-h-35 ${isDue ? 'border-cyan-500/40 shadow-[0_0_20px_rgba(0,243,255,0.08)]' : 'border-cyan-500/20'}`}>
                <p className="text-sm text-violet-300 font-semibold mb-2">{card.title}</p>
                <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">{card.content}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                    onClick={() => submitReview('again')}
                    disabled={saving}
                    className="px-3 py-2 bg-[#0F061A] border border-cyan-500/30 rounded-lg text-slate-300 hover:text-white hover:border-violet-500/60 transition-colors"
                >
                    Again
                </button>
                <button
                    onClick={() => submitReview('good')}
                    disabled={saving}
                    className="px-3 py-2 bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-100 hover:text-white hover:border-violet-500/70 transition-colors"
                >
                    Good
                </button>
                <button
                    onClick={() => submitReview('easy')}
                    disabled={saving}
                    className="px-3 py-2 bg-violet-500/20 border border-violet-500/40 rounded-lg text-violet-100 hover:text-white hover:border-cyan-500/70 transition-colors"
                >
                    Easy
                </button>
                {saving && <span className="text-[10px] text-slate-400">Saving review...</span>}
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
