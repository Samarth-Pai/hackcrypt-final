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
        <div className="min-h-screen bg-earth text-[#ededed] p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-[#5D4037]/40 p-6 rounded-xl border border-[#5D4037]">
                    <h1 className="text-2xl font-bold text-growth mb-2">{story.title}</h1>
                    <p className="text-sm text-gray-300">Topic: {story.topic}</p>
                </div>
                <StoryPlayer story={story} />
            </div>
        </div>
    );
}
