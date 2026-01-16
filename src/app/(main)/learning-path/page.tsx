import Link from 'next/link';
import { Map, Compass, Network } from 'lucide-react';
import { getSessionUserDoc } from '@/lib/session';

const nodes = [
    { id: 'cs', title: 'CS Fundamentals', x: 10, y: 20, status: 'core' },
    { id: 'math', title: 'Mathematics Core', x: 40, y: 10, status: 'core' },
    { id: 'bio', title: 'Biology Basics', x: 70, y: 25, status: 'explore' },
    { id: 'physics', title: 'Physics Core', x: 25, y: 55, status: 'challenge' },
    { id: 'chem', title: 'Chemistry Core', x: 60, y: 60, status: 'challenge' },
    { id: 'duels', title: 'Live Duels', x: 85, y: 45, status: 'arena' },
];

const edges = [
    ['cs', 'math'],
    ['cs', 'physics'],
    ['math', 'physics'],
    ['bio', 'chem'],
    ['physics', 'chem'],
    ['chem', 'duels'],
];

export default async function LearningPathPage() {
    const data = await getSessionUserDoc();
    const performance = data?.user?.performance;
    const totalCorrect = performance?.totalCorrect || 0;

    const skillNodes = [
        { id: 'binary', label: 'Binary Foundations', threshold: 0, deps: [] as string[] },
        { id: 'ds', label: 'Data Structures', threshold: 4, deps: ['binary'] },
        { id: 'algo', label: 'Algorithms', threshold: 8, deps: ['ds'] },
        { id: 'logic', label: 'Logic Gates', threshold: 6, deps: ['binary'] },
        { id: 'systems', label: 'Systems Thinking', threshold: 12, deps: ['algo'] },
        { id: 'networks', label: 'Networks', threshold: 14, deps: ['logic'] },
    ];

    const unlockedMap = skillNodes.reduce<Record<string, boolean>>((acc, node) => {
        acc[node.id] = totalCorrect >= node.threshold;
        return acc;
    }, {});
    return (
        <div className="min-h-screen text-[#E2E8F0] p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Map className="w-8 h-8 text-cyan-300" />
                    <div>
                        <h1 className="text-3xl font-bold text-cyan-200 text-glow">Learning Path Map</h1>
                        <p className="text-sm text-slate-400">Navigate your quest line and unlock mastery nodes.</p>
                    </div>
                </div>

                <div className="relative h-160 rounded-3xl border border-cyan-500/30 glass-cosmic overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,0,255,0.18),transparent_45%)]" />
                    <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

                    <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                        {edges.map(([from, to]) => {
                            const start = nodes.find((n) => n.id === from);
                            const end = nodes.find((n) => n.id === to);
                            if (!start || !end) return null;
                            return (
                                <line
                                    key={`${from}-${to}`}
                                    x1={`${start.x}%`}
                                    y1={`${start.y}%`}
                                    x2={`${end.x}%`}
                                    y2={`${end.y}%`}
                                    stroke="rgba(0,243,255,0.25)"
                                    strokeWidth="2"
                                    strokeDasharray="6 8"
                                />
                            );
                        })}
                    </svg>

                    {nodes.map((node) => (
                        <Link
                            key={node.id}
                            href={node.id === 'duels' ? '/duels' : '/syllabus'}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 px-4 py-3 rounded-2xl border text-sm font-bold transition-all ${node.status === 'core' ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-200' : node.status === 'challenge' ? 'bg-violet-500/15 border-violet-400/50 text-violet-200' : node.status === 'arena' ? 'bg-blue-500/20 border-blue-400/50 text-blue-200' : 'bg-[#0B0014]/60 border-cyan-500/20 text-slate-200'}`}
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        >
                            <span className="block text-[10px] uppercase tracking-widest text-slate-400">{node.status}</span>
                            {node.title}
                        </Link>
                    ))}

                    <div className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-2 rounded-full bg-[#0B0014]/60 border border-cyan-500/30 text-xs text-slate-400">
                        <Compass size={14} /> Drag to explore (coming soon)
                    </div>
                </div>

                <div className="glass-cosmic rounded-3xl border border-cyan-500/30 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Network className="text-violet-300" size={20} />
                        <h2 className="text-lg font-bold text-violet-200 uppercase tracking-widest">Skill Graph</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-violet-500/50 to-transparent" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {skillNodes.map((node) => {
                            const isUnlocked = unlockedMap[node.id];
                            return (
                                <div
                                    key={node.id}
                                    className={`p-4 rounded-2xl border transition-colors ${isUnlocked ? 'border-cyan-500/40 bg-cyan-500/10' : 'border-slate-700/40 bg-[#0B0014]/60'}`}
                                >
                                    <p className="text-xs uppercase tracking-widest text-slate-400">{isUnlocked ? 'Unlocked' : 'Locked'}</p>
                                    <h3 className={`text-sm font-bold ${isUnlocked ? 'text-cyan-200' : 'text-slate-500'}`}>{node.label}</h3>
                                    {node.deps.length > 0 && (
                                        <p className="text-[10px] text-slate-500 mt-2">Prereq: {node.deps.map((dep) => skillNodes.find((n) => n.id === dep)?.label || dep).join(', ')}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-4">Unlocks are based on total correct answers. Keep solving questions to open new nodes.</p>
                </div>
            </div>
        </div>
    );
}
