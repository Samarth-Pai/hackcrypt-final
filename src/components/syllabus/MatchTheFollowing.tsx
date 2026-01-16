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
        <div className="bg-[#5D4037]/40 p-6 rounded-xl border border-[#5D4037]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-growth">Match the Following</h3>
                <span className="text-xs text-gray-400">{submitted ? `${correctCount} / ${pairs.length}` : `${Object.keys(selections).length} / ${pairs.length}`}</span>
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
                                className={`p-4 rounded-xl border ${isCorrect ? 'border-growth' : isWrong ? 'border-red-500' : 'border-[#5D4037]'} bg-earth/80 transition-colors`}
                            >
                                <p className="text-sm text-white mb-3">{pair.left}</p>
                                <div className="flex items-center gap-3">
                                    <div className={`flex-1 px-3 py-2 rounded-lg text-sm ${selected ? 'bg-[#1B1B1B] text-gray-200 border border-[#5D4037]' : 'bg-[#2E1E1A] text-gray-500 border border-dashed border-[#5D4037]'}`}>
                                        {selected || 'Drag a match here'}
                                    </div>
                                    {selected && (
                                        <button
                                            onClick={() => handleUnassign(pair.left)}
                                            className="text-xs text-gray-400 hover:text-white"
                                        >
                                            Clear
                                        </button>
                                    )}
                                    {submitted && (
                                        <span className={`text-xs ${isCorrect ? 'text-growth' : isWrong ? 'text-red-300' : 'text-gray-400'}`}>
                                            {isCorrect ? 'Correct' : isWrong ? `Correct: ${pair.right}` : ''}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="space-y-3">
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Drag these</p>
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
                                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${isUsed ? 'bg-[#2E1E1A] border-[#3E2723] text-gray-500 cursor-not-allowed' : dragging === option ? 'bg-forest/30 border-growth text-growth' : 'bg-[#1B1B1B] border-[#5D4037] text-gray-200 cursor-grab'}`}
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
                    className="px-4 py-2 bg-forest text-white rounded-full hover:bg-[#1B5E20]"
                >
                    Check Answers
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-[#3E2723] text-gray-200 rounded-full border border-[#5D4037] hover:border-sun"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
