import { Flame } from 'lucide-react';

const milestones = [1, 3, 7, 14, 30];

type StreakPanelProps = {
    streakCount: number;
    lastActive?: string | Date | null;
};

function startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function StreakPanel({ streakCount, lastActive }: StreakPanelProps) {
    const today = startOfDay(new Date());
    const lastDate = lastActive ? startOfDay(new Date(lastActive)) : null;

    const streakStart = lastDate
        ? new Date(lastDate.getTime() - Math.max(0, streakCount - 1) * 86400000)
        : null;

    const days = Array.from({ length: 7 }).map((_, idx) => {
        const date = new Date(today.getTime() - (6 - idx) * 86400000);
        const isActive = streakStart && lastDate
            ? date >= streakStart && date <= lastDate
            : false;
        return { date, isActive };
    });

    const needsReminder = !lastDate || lastDate.getTime() < today.getTime();

    return (
        <div className="glass-cosmic rounded-3xl border border-violet-500/30 p-6">
            <div className="flex items-center gap-2 text-violet-200 mb-4">
                <Flame size={18} />
                <h3 className="text-xs uppercase tracking-[0.3em] font-black">Momentum Chain</h3>
            </div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-3xl font-black text-slate-100">{streakCount} Day Streak</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400">Keep your chain alive</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Daily Reminder</p>
                    <p className={`text-xs font-bold ${needsReminder ? 'text-rose-300' : 'text-cyan-300'}`}>
                        {needsReminder ? 'Log a mission today' : 'Streak secured'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
                {days.map((day) => (
                    <div
                        key={day.date.toISOString()}
                        className={`h-8 rounded-lg border text-[10px] flex items-center justify-center ${day.isActive ? 'bg-violet-500/30 border-violet-400 text-violet-100' : 'bg-[#0B0014]/60 border-slate-700 text-slate-500'}`}
                    >
                        {day.date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)}
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Milestones</p>
                <div className="flex flex-wrap gap-2">
                    {milestones.map((milestone) => (
                        <span
                            key={milestone}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold border ${streakCount >= milestone ? 'border-cyan-400 text-cyan-200 bg-cyan-500/20' : 'border-slate-700 text-slate-500 bg-[#0B0014]/60'}`}
                        >
                            {milestone}D
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
