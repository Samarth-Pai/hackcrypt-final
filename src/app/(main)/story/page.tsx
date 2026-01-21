import Link from 'next/link';
import { Map, Lock, FolderOpen } from 'lucide-react';
import clientPromise from '@/lib/mongodb';
import type { StoryGroup } from '@/lib/stories';
import HolographicMap from '@/components/story/HolographicMap';

export const dynamic = 'force-dynamic';

export default async function StoryMapPage() {
    const client = await clientPromise;
    const db = client.db();
    const rawStoryGroups = await db.collection<StoryGroup>('stories').find({}).toArray();
    // Serialize for Client Component
    const storyGroups: StoryGroup[] = JSON.parse(JSON.stringify(rawStoryGroups));

    const nodes = [
        { slug: 'cs-fundamentals', x: 12, y: 18 },
        { slug: 'mathematics-core', x: 42, y: 12 },
        { slug: 'biology-basics', x: 68, y: 22 },
        { slug: 'physics-core', x: 28, y: 60 },
        { slug: 'chemistry-core', x: 70, y: 58 },
    ];

    return (
        <div className="min-h-screen text-[#E2E8F0] p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/assets/cosmic/bg-stars.png')] bg-cover opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 border-b border-cyan-500/30 pb-6">
                    <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                        <Map className="w-8 h-8 text-cyan-300" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            Campaign Map <span className="text-cyan-500 text-sm bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">v.4.0.2</span>
                        </h1>
                        <p className="text-sm text-cyan-400/60 font-mono tracking-widest mt-1">S.H.I.E.L.D. AUTHORIZED PERSONNEL ONLY</p>
                    </div>
                </div>

                {/* Holographic Map */}
                <div className="relative rounded-3xl border border-cyan-500/20 bg-slate-950/50 backdrop-blur-sm overflow-visible">
                    <div className="absolute top-0 left-0 p-4 font-mono text-[10px] text-cyan-500/40">
                        TACTICAL OVERVIEW
                        <br />
                        SECURE CONNECTION ESTABLISHED
                    </div>

                    <HolographicMap nodes={nodes} storyGroups={storyGroups} />
                </div>

                {/* Mission Dossiers */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-cyan-200 uppercase tracking-widest flex items-center gap-2">
                        <FolderOpen className="text-cyan-500" size={20} />
                        Mission Files
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {storyGroups.map((group) => (
                            <Link
                                key={group.syllabusSlug}
                                href={`/story/${group.syllabusSlug}`}
                                className="group relative overflow-hidden bg-slate-900/80 border-l-4 border-cyan-500/50 hover:border-cyan-400 transition-all duration-300 rounded-r-xl border-y border-r border-y-white/5 border-r-white/5 hover:bg-slate-800/80"
                            >
                                {/* Top Secret Stamp */}
                                <div className="absolute -right-4 -top-2 rotate-12 border-2 border-red-500/20 text-red-500/20 px-2 py-1 text-[10px] font-black uppercase tracking-widest pointer-events-none group-hover:text-red-500/40 group-hover:border-red-500/40 transition-colors">
                                    Confidential
                                </div>

                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="bg-cyan-950 px-2 py-1 rounded text-[10px] font-mono text-cyan-400 border border-cyan-500/20">
                                            SEC-9
                                        </div>
                                        <Lock className="w-4 h-4 text-slate-600 group-hover:text-cyan-400/50 transition-colors" />
                                    </div>

                                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-1">{group.syllabusTitle}</h3>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                                        <p className="text-xs text-slate-400 font-mono">{group.stories.length} ACTIVE MISSIONS</p>
                                    </div>

                                    {/* Decoration Lines */}
                                    <div className="w-full h-px bg-gradient-to-r from-cyan-500/20 to-transparent group-hover:from-cyan-500/50 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
