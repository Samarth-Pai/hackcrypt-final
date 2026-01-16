import Leaderboard from '@/components/gamification/Leaderboard';
import { Trophy } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function LeaderboardPage() {
    return (
        <div className="min-h-screen bg-earth text-[#ededed] p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-sun" />
                    <div>
                        <h1 className="text-3xl font-bold text-growth">Global Leaderboard</h1>
                        <p className="text-sm text-gray-400">Top explorers ranked by XP.</p>
                    </div>
                </div>

                <div className="bg-[#5D4037]/40 p-6 rounded-xl border border-[#5D4037]">
                    <Leaderboard />
                </div>
            </div>
        </div>
    );
}
