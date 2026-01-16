import Link from 'next/link';
import { Map, Compass } from 'lucide-react';

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

export default function LearningPathPage() {
    return (
        <div className="min-h-screen bg-earth text-[#ededed] p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Map className="w-8 h-8 text-sun" />
                    <div>
                        <h1 className="text-3xl font-bold text-growth">Learning Path Map</h1>
                        <p className="text-sm text-gray-400">Navigate your quest line and unlock mastery nodes.</p>
                    </div>
                </div>

                <div className="relative h-160 rounded-3xl border border-[#5D4037] bg-[#2E1E1A]/70 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(198,255,0,0.15),transparent_45%)]" />
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
                                    stroke="rgba(198,255,0,0.25)"
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
                            className={`absolute -translate-x-1/2 -translate-y-1/2 px-4 py-3 rounded-2xl border text-sm font-bold transition-all ${node.status === 'core' ? 'bg-forest/30 border-growth text-growth' : node.status === 'challenge' ? 'bg-sun/10 border-sun text-sun' : node.status === 'arena' ? 'bg-purple-ai/20 border-purple-ai text-purple-ai' : 'bg-[#3E2723]/70 border-[#5D4037] text-gray-200'}`}
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        >
                            <span className="block text-[10px] uppercase tracking-widest text-gray-400">{node.status}</span>
                            {node.title}
                        </Link>
                    ))}

                    <div className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-2 rounded-full bg-[#1B1B1B] border border-[#5D4037] text-xs text-gray-400">
                        <Compass size={14} /> Drag to explore (coming soon)
                    </div>
                </div>
            </div>
        </div>
    );
}
