import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSessionUser } from '@/lib/session';

export async function POST(request: Request) {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { userId } = await request.json();
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    if (String(userId) === session.userId.toString()) {
        return NextResponse.json({ error: 'Cannot unfollow yourself' }, { status: 400 });
    }

    let targetId: ObjectId;
    try {
        targetId = new ObjectId(userId);
    } catch {
        return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();

    const users = db.collection<{ following: ObjectId[]; followers: ObjectId[] }>('users');

    await users.updateOne(
        { _id: session.userId },
        { $pull: { following: targetId } }
    );

    await users.updateOne(
        { _id: targetId },
        { $pull: { followers: session.userId } }
    );

    return NextResponse.json({ success: true });
}
