import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const client = await clientPromise;
    const db = client.db();
    let userId: ObjectId;
    try {
        userId = new ObjectId(params.id);
    } catch {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const user = await db.collection('users').findOne({ _id: userId });

    if (!user) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
        id: user._id,
        name: user.name,
        gamification: user.gamification,
        followers: user.followers || [],
        following: user.following || [],
    });
}
