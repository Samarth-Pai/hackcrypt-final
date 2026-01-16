import { NextResponse } from 'next/server';
import { getSessionUserDoc } from '@/lib/session';

export async function GET(request: Request) {
    const data = await getSessionUserDoc();
    if (!data) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const syllabusSlug = String(searchParams.get('syllabusSlug') || '').trim();
    if (!syllabusSlug) {
        return NextResponse.json({ error: 'Missing syllabusSlug' }, { status: 400 });
    }

    const schedule = (data.user?.performance?.flashcards?.[syllabusSlug] || {}) as Record<string, {
        interval?: number;
        repetition?: number;
        ease?: number;
        due?: string;
    }>;

    const now = Date.now();
    const dueCount = Object.values(schedule).filter((item) => {
        if (!item?.due) return true;
        return new Date(item.due).getTime() <= now;
    }).length;

    return NextResponse.json({ schedule, dueCount });
}
