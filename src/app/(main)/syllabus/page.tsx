import Link from 'next/link';
import clientPromise from '@/lib/mongodb';
import { getSessionUserDoc } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function SyllabusPage() {
    const client = await clientPromise;
    const db = client.db();
    const syllabi = await db.collection('syllabi').find({}).toArray();
    const data = await getSessionUserDoc();
    const user = data?.user;

    const subjectStats = Object.entries(user?.performance?.bySubject || {}).map(([subject, stats]) => {
        const typedStats = stats as { total?: number; correct?: number };
        const total = typedStats?.total || 0;
        const correct = typedStats?.correct || 0;
        const accuracy = total > 0 ? correct / total : 0;
        return { subject, accuracy, total };
    });

    const weakSubjects = subjectStats
        .filter((s) => s.total > 0)
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 2)
        .map((s) => s.subject);

    const recommendations = weakSubjects.length > 0
        ? syllabi.filter((s) => weakSubjects.includes(s.subject))
        : [];

    return (
        <div className="min-h-screen text-[#E2E8F0] p-6 space-y-8">
            <div className="max-w-5xl mx-auto space-y-3">
                <h1 className="text-3xl font-bold text-cyan-200 text-glow">Syllabus Library</h1>
                <p className="text-slate-400">Choose a domain, study flashcards, then attempt the quiz.</p>
            </div>

            {recommendations.length > 0 && (
                <div className="max-w-5xl mx-auto glass-cosmic p-6 rounded-xl border border-cyan-500/30">
                    <h2 className="text-lg font-bold text-cyan-200 mb-2">Recommended Focus</h2>
                    <p className="text-xs text-slate-400 mb-4">Based on your recent accuracy, these syllabi need more attention.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.map((syllabus) => (
                            <Link
                                key={syllabus._id.toString()}
                                href={`/syllabus/${syllabus.slug}`}
                                className="glass-cosmic p-4 rounded-xl border border-cyan-500/20 hover:border-violet-500/60 transition-colors"
                            >
                                <h3 className="text-sm font-bold text-cyan-200 mb-1">{syllabus.title}</h3>
                                <p className="text-xs text-slate-300">{syllabus.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {syllabi.map((syllabus) => (
                    <Link
                        key={syllabus._id.toString()}
                        href={`/syllabus/${syllabus.slug}`}
                        className="glass-cosmic p-6 rounded-xl border border-cyan-500/20 hover:border-violet-500/60 transition-colors"
                    >
                        <h2 className="text-xl font-bold text-cyan-200 mb-2">{syllabus.title}</h2>
                        <p className="text-sm text-slate-300">{syllabus.description}</p>
                        <p className="text-xs text-violet-300 mt-3">Explore {syllabus.subject}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
