import { NextResponse, type NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();
    let userId: ObjectId;
    try {
        userId = new ObjectId(id);
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
