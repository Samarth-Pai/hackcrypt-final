'use client';

import { useEffect, useState } from 'react';
import { Activity, Shield } from 'lucide-react';
import CosmicCard from '@/components/cosmic/CosmicCard';

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
        <CosmicCard glow="blue" className="p-0">
            <div className="p-6">
                <div className="flex items-center gap-2 text-blue-400 mb-6">
                    <Activity size={16} />
                    <h3 className="text-xs uppercase tracking-[0.3em] font-black">Active Missions</h3>
                </div>
                <div className="space-y-4">
                    {quests.length === 0 && (
                        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
                            Missions syncing...
                        </div>
                    )}
                    {quests.map((quest) => {
                        const progressPct = Math.min(100, Math.round((quest.progress / quest.target) * 100));
                        return (
                            <div key={quest.id} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 group hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Shield size={60} className="text-blue-500" />
                                </div>
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-100 mb-1">{quest.title}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold">REWARD: +{quest.rewardXp} XP</p>
                                        <p className="text-[10px] text-slate-500 font-medium mt-1">{quest.description}</p>
                                    </div>
                                    <div className="px-2 py-1 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[9px] font-black">{progressPct}% COM</div>
                                </div>
                                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-3">
                                    <div className="h-full bg-blue-500" style={{ width: `${progressPct}%` }} />
                                </div>
                                <div className="mt-2 text-[10px] text-slate-500 text-right">{quest.progress} / {quest.target}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </CosmicCard>
    );
}
