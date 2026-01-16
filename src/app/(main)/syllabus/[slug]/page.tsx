import clientPromise from '@/lib/mongodb';
import SyllabusDetail from '@/components/syllabus/SyllabusDetail';

export const dynamic = 'force-dynamic';

export default async function SyllabusDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const client = await clientPromise;
    const db = client.db();

    const syllabus = await db.collection('syllabi').findOne({ slug });
    if (!syllabus) {
        return <div className="text-white p-8">Syllabus not found.</div>;
    }

    const questions = await db.collection('questions')
        .find({ syllabusSlug: syllabus.slug })
        .limit(10)
        .toArray();

    const formatted = questions.map((q) => ({
        id: q._id.toString(),
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
    }));

    return (
        <div className="min-h-screen text-[#E2E8F0] p-6">
            <div className="max-w-4xl mx-auto">
                <SyllabusDetail
                    title={syllabus.title}
                    description={syllabus.description}
                    flashcards={syllabus.flashcards || []}
                    questions={formatted}
                    matchPairs={syllabus.matchPairs || []}
                />
            </div>
        </div>
    );
}
