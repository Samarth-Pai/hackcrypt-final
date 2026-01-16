import Link from 'next/link';
import { Map } from 'lucide-react';
import clientPromise from '@/lib/mongodb';
import type { StoryGroup } from '@/lib/stories';

export const dynamic = 'force-dynamic';

export default async function StoryMapPage() {
    const client = await clientPromise;
    const db = client.db();
    const storyGroups = await db.collection<StoryGroup>('stories').find({}).toArray();

    const nodes = [
        { slug: 'cs-fundamentals', x: 12, y: 18 },
        { slug: 'mathematics-core', x: 42, y: 12 },
        { slug: 'biology-basics', x: 68, y: 22 },
        { slug: 'physics-core', x: 28, y: 60 },
        { slug: 'chemistry-core', x: 70, y: 58 },
    ];

    return (
        <div className="min-h-screen bg-earth text-[#ededed] p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Map className="w-8 h-8 text-sun" />
                    <div>
                        <h1 className="text-3xl font-bold text-growth">Story Mode Map</h1>
                        <p className="text-sm text-gray-400">Follow story arcs by syllabus and unlock topic missions.</p>
                    </div>
                </div>

                <div className="relative h-160 rounded-3xl border border-[#5D4037] bg-[#2E1E1A]/70 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(198,255,0,0.15),transparent_45%)]" />
                    <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

                    {nodes.map((node) => {
                        const group = storyGroups.find((g) => g.syllabusSlug === node.slug);
                        if (!group) return null;
                        return (
                            <Link
                                key={node.slug}
                                href={`/story/${node.slug}`}
                                className="absolute -translate-x-1/2 -translate-y-1/2 px-4 py-3 rounded-2xl border border-sun/40 bg-sun/10 text-sun font-bold text-sm hover:bg-sun/20 transition-all"
                                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                            >
                                <span className="block text-[10px] uppercase tracking-widest text-gray-400">{group.stories.length} stories</span>
                                {group.syllabusTitle}
                            </Link>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {storyGroups.map((group) => (
                        <Link
                            key={group.syllabusSlug}
                            href={`/story/${group.syllabusSlug}`}
                            className="bg-[#5D4037]/40 p-5 rounded-xl border border-[#5D4037] hover:border-sun transition-colors"
                        >
                            <h2 className="text-lg font-bold text-growth mb-1">{group.syllabusTitle}</h2>
                            <p className="text-xs text-gray-400">{group.stories.length} story missions available</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
