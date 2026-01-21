import { NextResponse, type NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSessionUserDoc } from '@/lib/session';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getSessionUserDoc();
    if (!data) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { user } = data;

    const client = await clientPromise;
    const db = client.db();

    const classroom = await db.collection('classrooms').findOne({ _id: new ObjectId(id) });
    if (!classroom) return NextResponse.json({ error: 'Classroom not found' }, { status: 404 });

    const isMember = classroom.members?.some((memberId: ObjectId) => memberId.equals(user._id));
    if (!isMember) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const leaderboard = await db.collection('users')
        .aggregate([
            { $match: { _id: { $in: classroom.members } } },
            { $sort: { 'gamification.xp': -1 } },
            { $limit: 20 },
            { $project: { name: 1, 'gamification.level': 1, 'gamification.xp': 1 } },
        ])
        .toArray();

    return NextResponse.json({ leaderboard });
}
