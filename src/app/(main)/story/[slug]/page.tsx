import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import clientPromise from '@/lib/mongodb';
import type { StoryGroup } from '@/lib/stories';

export const dynamic = 'force-dynamic';

export default async function StorySyllabusPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const client = await clientPromise;
    const db = client.db();
    const group = await db.collection<StoryGroup>('stories').findOne({ syllabusSlug: slug });

    if (!group) {
        return notFound();
    }

    return (
        <div className="min-h-screen text-[#E2E8F0] p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-cyan-300" />
                    <div>
                        <h1 className="text-3xl font-bold text-cyan-200 text-glow">{group.syllabusTitle} Stories</h1>
                        <p className="text-sm text-slate-400">Choose a topic-driven mission.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.stories.map((story) => (
                        <Link
                            key={story.id}
                            href={`/story/${slug}/${story.id}`}
                            className="glass-cosmic p-5 rounded-xl border border-cyan-500/20 hover:border-violet-500/60 transition-colors"
                        >
                            <h2 className="text-lg font-bold text-cyan-200">{story.title}</h2>
                            <p className="text-xs text-slate-400">Topic: {story.topic}</p>
                            <p className="text-xs text-violet-300 mt-2">{story.cards.length} cards • {story.questions.length} questions</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
