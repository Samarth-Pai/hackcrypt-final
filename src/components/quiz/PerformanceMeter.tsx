'use client';

import { Gauge } from 'lucide-react';

interface PerformanceMeterProps {
    accuracy: number; // 0-1
    speed: number; // 0-1
    score: number; // 0-100
}

export default function PerformanceMeter({ accuracy, speed, score }: PerformanceMeterProps) {
    const accuracyPct = Math.round(accuracy * 100);
    const speedPct = Math.round(speed * 100);

    return (
        <div className="bg-[#5D4037]/40 p-5 rounded-xl border border-[#5D4037]">
            <div className="flex items-center gap-2 text-growth mb-4">
                <Gauge className="w-5 h-5" />
                <h3 className="font-bold">AI Performance Score</h3>
            </div>
            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Accuracy</span>
                        <span>{accuracyPct}%</span>
                    </div>
                    <div className="h-2 bg-[#1B1B1B] rounded-full overflow-hidden">
                        <div className="h-full bg-growth" style={{ width: `${accuracyPct}%` }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Speed</span>
                        <span>{speedPct}%</span>
                    </div>
                    <div className="h-2 bg-[#1B1B1B] rounded-full overflow-hidden">
                        <div className="h-full bg-sun" style={{ width: `${speedPct}%` }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Final Score</span>
                        <span>{score}</span>
                    </div>
                    <div className="h-2 bg-[#1B1B1B] rounded-full overflow-hidden">
                        <div className="h-full bg-forest" style={{ width: `${score}%` }}></div>
                    </div>
                </div>
            </div>
            <p className="mt-4 text-xs text-gray-400 italic">
                “This score drives our adaptive difficulty engine.”
            </p>
        </div>
    );
}
