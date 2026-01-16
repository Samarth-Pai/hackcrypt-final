'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

type Recommendation = {
    subject: string;
    reason: string;
    suggestedDifficulty: number;
};

export default function RecommendationsPanel() {
    const [items, setItems] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await fetch('/api/recommendations');
                if (!response.ok) return;
                const data = await response.json();
                setItems(data.recommendations || []);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <div className="bg-[#5D4037]/40 p-6 rounded-xl border border-[#5D4037]">
            <div className="flex items-center gap-2 mb-4 text-[#C6FF00]">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-lg font-bold">Recommended Practice</h3>
            </div>
            {loading && <p className="text-sm text-gray-400">Loading recommendations...</p>}
            {!loading && items.length === 0 && (
                <p className="text-sm text-gray-400">No recommendations yet. Take a quiz to get started.</p>
            )}
            <div className="space-y-3">
                {items.map((item) => (
                    <div key={`${item.subject}-${item.reason}`} className="p-3 bg-[#3E2723]/60 rounded-lg border border-[#5D4037]">
                        <p className="font-semibold text-[#ededed]">{item.subject}</p>
                        <p className="text-xs text-gray-400">{item.reason}</p>
                        <p className="text-xs text-[#FFD600]">Suggested difficulty: {item.suggestedDifficulty}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
