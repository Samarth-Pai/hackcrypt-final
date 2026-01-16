import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getSessionUser } from '@/lib/session';

export async function POST(request: Request) {
    const session = await getSessionUser();
    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const storyId = String(body?.storyId || '').trim();
    const correct = Boolean(body?.correct);
    const progress = Number.isFinite(body?.progress) ? Math.max(0, Math.min(100, Number(body.progress))) : 0;
    const completed = Boolean(body?.completed);

    if (!storyId) {
        return NextResponse.json({ error: 'Missing storyId' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const progressKey = `performance.storyProgress.${storyId}`;
    await db.collection('users').updateOne(
        { _id: session.userId },
        {
            $inc: {
                'performance.totalQuestions': 1,
                'performance.totalCorrect': correct ? 1 : 0,
                'gamification.xp': correct ? 5 : 0,
                [`${progressKey}.attempts`]: 1,
                [`${progressKey}.correct`]: correct ? 1 : 0,
            },
            $set: {
                [`${progressKey}.progress`]: progress,
                [`${progressKey}.completed`]: completed,
                [`${progressKey}.updatedAt`]: new Date(),
            },
        }
    );

    return NextResponse.json({ success: true });
}
