'use client';

import { useEffect, useState } from 'react';
import { Activity, Shield } from 'lucide-react';

export default function ActiveMissions() {
    const [quests, setQuests] = useState<Array<{ id: string; title: string; description: string; progress: number; target: number; rewardXp: number }>>([]);

    useEffect(() => {
        const loadQuests = async () => {
            const response = await fetch('/api/quests');
            if (response.ok) {
                const data = await response.json();
                setQuests(data.quests || []);
            }
        };

        loadQuests();
    }, []);

    return (
        <div className="glass-v2 p-6 rounded-[32px] border border-white/5">
            <div className="flex items-center gap-2 text-purple-ai mb-6">
                <Activity size={16} />
                <h3 className="text-xs uppercase tracking-[0.3em] font-black">Active Missions</h3>
            </div>
            <div className="space-y-4">
                {quests.length === 0 && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-400">
                        Missions syncing...
                    </div>
                )}
                {quests.map((quest) => {
                    const progressPct = Math.min(100, Math.round((quest.progress / quest.target) * 100));
                    return (
                        <div key={quest.id} className="p-4 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Shield size={60} className="text-purple-ai" />
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">{quest.title}</h4>
                                    <p className="text-[10px] text-gray-500 font-bold">REWARD: +{quest.rewardXp} XP</p>
                                    <p className="text-[10px] text-gray-500">{quest.description}</p>
                                </div>
                                <div className="px-2 py-1 rounded bg-purple-ai text-white text-[9px] font-black">{progressPct}% COM</div>
                            </div>
                            <div className="w-full h-1 bg-teal-bg rounded-full overflow-hidden mt-3">
                                <div className="h-full bg-purple-ai" style={{ width: `${progressPct}%` }} />
                            </div>
                            <div className="mt-2 text-[10px] text-gray-400">{quest.progress} / {quest.target}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
