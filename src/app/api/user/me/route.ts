import { NextResponse } from 'next/server';
import { getSessionUserDoc } from '@/lib/session';

export async function GET() {
    const data = await getSessionUserDoc();
    if (!data) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { user, session } = data;

    return NextResponse.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || session.role || 'student',
        gamification: user.gamification,
        performance: user.performance,
    });
}
