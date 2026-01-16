import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getSessionUser } from '@/lib/session';

function getWeekStart(date: Date) {
    const day = date.getDay();
    const diff = (day + 6) % 7;
    const start = new Date(date);
    start.setDate(date.getDate() - diff);
    start.setHours(0, 0, 0, 0);
    return start.toISOString().slice(0, 10);
}

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

    const weekStart = getWeekStart(new Date());
    const existingUser = await db.collection('users').findOne(
        { _id: session.userId },
        { projection: { 'performance.weekly': 1 } }
    );

    if (existingUser?.performance?.weekly?.weekStart !== weekStart) {
        await db.collection('users').updateOne(
            { _id: session.userId },
            {
                $set: {
                    'performance.weekly': {
                        weekStart,
                        questions: 0,
                        correct: 0,
                        quizzesCompleted: 0,
                        storiesCompleted: 0,
                        completedStoryIds: [],
                    },
                },
            }
        );
    }

    const progressKey = `performance.storyProgress.${storyId}`;
    await db.collection('users').updateOne(
        { _id: session.userId },
        {
            $inc: {
                'performance.totalQuestions': 1,
                'performance.totalCorrect': correct ? 1 : 0,
                'gamification.xp': correct ? 5 : 0,
                'performance.weekly.questions': 1,
                'performance.weekly.correct': correct ? 1 : 0,
                [`${progressKey}.attempts`]: 1,
                [`${progressKey}.correct`]: correct ? 1 : 0,
            },
            $set: {
                [`${progressKey}.progress`]: progress,
                [`${progressKey}.completed`]: completed,
                [`${progressKey}.updatedAt`]: new Date(),
            },
            ...(completed ? { $addToSet: { 'performance.weekly.completedStoryIds': storyId } } : {}),
        }
    );

    if (completed) {
        const updatedUser = await db.collection('users').findOne(
            { _id: session.userId },
            { projection: { 'performance.weekly.completedStoryIds': 1 } }
        );
        const completedIds = updatedUser?.performance?.weekly?.completedStoryIds || [];
        await db.collection('users').updateOne(
            { _id: session.userId },
            { $set: { 'performance.weekly.storiesCompleted': completedIds.length } }
        );
    }

    return NextResponse.json({ success: true });
}
