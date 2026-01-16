import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = Math.max(1, Math.min(50, Number(searchParams.get('limit') || 10)));

    const client = await clientPromise;
    const db = client.db();

    const leaderboard = await db.collection('users')
        .aggregate([
            { $sort: { 'gamification.xp': -1 } },
            { $limit: limit },
            {
                $project: {
                    name: 1,
                    'gamification.level': 1,
                    'gamification.xp': 1,
                },
            },
        ])
        .toArray();

    return NextResponse.json({ leaderboard });
}
