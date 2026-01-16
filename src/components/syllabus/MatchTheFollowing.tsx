'use client';

import { useMemo, useState } from 'react';

export type MatchPair = {
    left: string;
    right: string;
};

export default function MatchTheFollowing({ pairs }: { pairs: MatchPair[] }) {
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [dragging, setDragging] = useState<string | null>(null);
    const rightOptions = useMemo(() => {
        const hash = (value: string) => value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return [...pairs.map((pair) => pair.right)].sort((a, b) => hash(a) - hash(b));
    }, [pairs]);

    const correctCount = pairs.reduce((acc, pair) => {
        return selections[pair.left] === pair.right ? acc + 1 : acc;
    }, 0);

    const handleAssign = (left: string, right: string) => {
        setSelections((prev) => {
            const next = { ...prev };
            Object.keys(next).forEach((key) => {
                if (next[key] === right) delete next[key];
            });
            next[left] = right;
            return next;
        });
        if (submitted) setSubmitted(false);
    };

    const handleUnassign = (left: string) => {
        setSelections((prev) => {
            const next = { ...prev };
            delete next[left];
            return next;
        });
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    const handleReset = () => {
        setSelections({});
        setSubmitted(false);
    };

    return (
        <div className="glass-cosmic p-6 rounded-xl border border-cyan-500/30">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-cyan-200">Match the Following</h3>
                <span className="text-xs text-slate-400">{submitted ? `${correctCount} / ${pairs.length}` : `${Object.keys(selections).length} / ${pairs.length}`}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {pairs.map((pair, index) => {
                        const selected = selections[pair.left] || '';
                        const isCorrect = submitted && selected === pair.right;
                        const isWrong = submitted && selected && selected !== pair.right;

                        return (
                            <div
                                key={`${pair.left}-${index}`}
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={(event) => {
                                    const payload = event.dataTransfer.getData('text/plain');
                                    if (payload) handleAssign(pair.left, payload);
                                }}
                                className={`p-4 rounded-xl border ${isCorrect ? 'border-cyan-400' : isWrong ? 'border-red-500' : 'border-cyan-500/30'} bg-[#140A28]/80 transition-colors`}
                            >
                                <p className="text-sm text-slate-200 mb-3">{pair.left}</p>
                                <div className="flex items-center gap-3">
                                    <div className={`flex-1 px-3 py-2 rounded-lg text-sm ${selected ? 'bg-[#0F061A] text-slate-200 border border-cyan-500/30' : 'bg-[#120821] text-slate-500 border border-dashed border-cyan-500/30'}`}>
                                        {selected || 'Drag a match here'}
                                    </div>
                                    {selected && (
                                        <button
                                            onClick={() => handleUnassign(pair.left)}
                                            className="text-xs text-slate-400 hover:text-white"
                                        >
                                            Clear
                                        </button>
                                    )}
                                    {submitted && (
                                        <span className={`text-xs ${isCorrect ? 'text-cyan-200' : isWrong ? 'text-red-300' : 'text-slate-400'}`}>
                                            {isCorrect ? 'Correct' : isWrong ? `Correct: ${pair.right}` : ''}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="space-y-3">
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Drag these</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {rightOptions.map((option) => {
                            const isUsed = Object.values(selections).includes(option);
                            return (
                                <div
                                    key={option}
                                    draggable={!isUsed}
                                    onDragStart={(event) => {
                                        setDragging(option);
                                        event.dataTransfer.setData('text/plain', option);
                                    }}
                                    onDragEnd={() => setDragging(null)}
                                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${isUsed ? 'bg-[#140A28]/60 border-cyan-500/20 text-slate-500 cursor-not-allowed' : dragging === option ? 'bg-violet-500/20 border-violet-400 text-violet-200' : 'bg-[#0F061A] border-cyan-500/30 text-slate-200 cursor-grab'}`}
                                >
                                    {option}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-cyan-500/20 text-cyan-100 rounded-full border border-cyan-500/40 hover:border-violet-500/70 hover:text-white transition-colors"
                >
                    Check Answers
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-[#140A28] text-slate-200 rounded-full border border-cyan-500/30 hover:border-violet-500/60 transition-colors"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
