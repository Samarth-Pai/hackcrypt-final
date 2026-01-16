import { notFound } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import type { StoryGroup } from '@/lib/stories';
import StoryPlayer from '@/components/story/StoryPlayer';

export const dynamic = 'force-dynamic';

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string; storyId: string }> }) {
    const { slug, storyId } = await params;
    const client = await clientPromise;
    const db = client.db();
    const group = await db.collection<StoryGroup>('stories').findOne({ syllabusSlug: slug });
    const story = group?.stories.find((item) => item.id === storyId);

    if (!group || !story) {
        return notFound();
    }

    return (
        <div className="min-h-screen text-[#E2E8F0] p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="glass-cosmic p-6 rounded-xl border border-cyan-500/30">
                    <h1 className="text-2xl font-bold text-cyan-200 text-glow mb-2">{story.title}</h1>
                    <p className="text-sm text-slate-300">Topic: {story.topic}</p>
                </div>
                <StoryPlayer story={story} />
            </div>
        </div>
    );
}
