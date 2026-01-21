import { NextResponse } from 'next/server';
import { getSessionUserDoc } from '@/lib/session';
import { buildQuestProgress, type UserSnapshot } from '@/lib/quests';

export async function GET() {
    const data = await getSessionUserDoc();
    if (!data) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const quests = buildQuestProgress(data.user as UserSnapshot);
    return NextResponse.json({ quests });
}
