import Link from 'next/link';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export default async function SyllabusPage() {
    const client = await clientPromise;
    const db = client.db();
    const syllabi = await db.collection('syllabi').find({}).toArray();

    return (
        <div className="min-h-screen bg-earth text-[#ededed] p-6 space-y-8">
            <div className="max-w-5xl mx-auto space-y-3">
                <h1 className="text-3xl font-bold text-growth">Syllabus Library</h1>
                <p className="text-gray-400">Choose a domain, study flashcards, then attempt the quiz.</p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {syllabi.map((syllabus) => (
                    <Link
                        key={syllabus._id.toString()}
                        href={`/syllabus/${syllabus.slug}`}
                        className="bg-[#5D4037]/40 p-6 rounded-xl border border-[#5D4037] hover:border-growth transition-colors"
                    >
                        <h2 className="text-xl font-bold text-growth mb-2">{syllabus.title}</h2>
                        <p className="text-sm text-gray-300">{syllabus.description}</p>
                        <p className="text-xs text-sun mt-3">Explore {syllabus.subject}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
