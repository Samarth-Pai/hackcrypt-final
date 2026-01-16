import { NextResponse } from 'next/server';
import { getSessionUserDoc } from '@/lib/session';

export async function GET() {
    const data = await getSessionUserDoc();
    if (!data) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const performance = data.user.performance;
    const bySubject = performance?.bySubject || {};

    const subjectStats = Object.entries(bySubject).map(([subject, stats]) => {
        const total = stats.total || 0;
        const correct = stats.correct || 0;
        const accuracy = total > 0 ? correct / total : 0;
        return { subject, total, correct, accuracy };
    });

    subjectStats.sort((a, b) => a.accuracy - b.accuracy);

    const recommendations = subjectStats.slice(0, 3).map((stat) => ({
        subject: stat.subject,
        reason: `Accuracy ${(stat.accuracy * 100).toFixed(0)}%`,
        suggestedDifficulty: stat.accuracy < 0.6 ? 2 : 3,
    }));

    return NextResponse.json({
        recommendations: recommendations.length > 0
            ? recommendations
            : [
                { subject: 'Computer Science', reason: 'New learner path', suggestedDifficulty: 2 },
                { subject: 'Mathematics', reason: 'Core fundamentals', suggestedDifficulty: 2 },
            ],
    });
}
