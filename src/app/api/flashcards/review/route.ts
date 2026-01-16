import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getSessionUserDoc } from '@/lib/session';

type ReviewRating = 'again' | 'good' | 'easy';

type ReviewState = {
    interval: number;
    repetition: number;
    ease: number;
    due: string;
    lastReviewed: string;
};

const clampEase = (ease: number) => Math.max(1.3, Math.min(3.0, ease));

const computeNext = (state: ReviewState, rating: ReviewRating) => {
    let { interval, repetition, ease } = state;

    if (rating === 'again') {
        ease = clampEase(ease - 0.2);
        repetition = 0;
        interval = 1;
    } else if (rating === 'good') {
        repetition += 1;
        if (repetition === 1) interval = 1;
        else if (repetition === 2) interval = 6;
        else interval = Math.round(interval * ease);
    } else {
        repetition += 1;
        ease = clampEase(ease + 0.15);
        if (repetition === 1) interval = 2;
        else if (repetition === 2) interval = 8;
        else interval = Math.round(interval * ease * 1.3);
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + interval);

    return {
        interval,
        repetition,
        ease,
        due: dueDate.toISOString(),
        lastReviewed: new Date().toISOString(),
    } satisfies ReviewState;
};

export async function POST(request: Request) {
    const data = await getSessionUserDoc();
    if (!data) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const syllabusSlug = String(body?.syllabusSlug || '').trim();
    const cardKey = String(body?.cardKey || '').trim();
    const rating = String(body?.rating || '').trim() as ReviewRating;

    if (!syllabusSlug || !cardKey || !['again', 'good', 'easy'].includes(rating)) {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const currentSchedule = (data.user?.performance?.flashcards?.[syllabusSlug]?.[cardKey] || {}) as Partial<ReviewState>;
    const baseState: ReviewState = {
        interval: Number(currentSchedule.interval ?? 0),
        repetition: Number(currentSchedule.repetition ?? 0),
        ease: Number(currentSchedule.ease ?? 2.5),
        due: String(currentSchedule.due ?? new Date().toISOString()),
        lastReviewed: String(currentSchedule.lastReviewed ?? new Date().toISOString()),
    };

    const nextState = computeNext(baseState, rating);

    const client = await clientPromise;
    const db = client.db();

    const updateKey = `performance.flashcards.${syllabusSlug}.${cardKey}`;
    await db.collection('users').updateOne(
        { _id: data.user._id },
        {
            $set: {
                [updateKey]: nextState,
            },
        }
    );

    const schedule = (data.user?.performance?.flashcards?.[syllabusSlug] || {}) as Record<string, ReviewState>;
    const mergedSchedule = {
        ...schedule,
        [cardKey]: nextState,
    };

    const now = Date.now();
    const dueCount = Object.values(mergedSchedule).filter((item) => {
        if (!item?.due) return true;
        return new Date(item.due).getTime() <= now;
    }).length;

    return NextResponse.json({ schedule: mergedSchedule, dueCount });
}
