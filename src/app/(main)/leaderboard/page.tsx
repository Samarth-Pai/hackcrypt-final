import Leaderboard from '@/components/gamification/Leaderboard';
import { Trophy } from 'lucide-react';
import CosmicCard from '@/components/cosmic/CosmicCard';

export const dynamic = 'force-dynamic';

export default function LeaderboardPage() {
    return (
        <div className="min-h-screen p-6 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                        <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                            Global Leaderboard
                        </h1>
                        <p className="text-sm text-slate-400">Top explorers ranked by XP.</p>
                    </div>
                </div>

                <CosmicCard glow="none" className="p-0 bg-opacity-40">
                    <Leaderboard />
                </CosmicCard>
            </div>
        </div>
    );
}
