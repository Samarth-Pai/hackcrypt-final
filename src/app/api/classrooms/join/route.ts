import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getSessionUserDoc } from '@/lib/session';

export async function POST(request: Request) {
    const data = await getSessionUserDoc();
    if (!data) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { user } = data;
    const { code } = await request.json();
    if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db();

    const classroom = await db.collection('classrooms').findOne({ code: String(code).toUpperCase() });
    if (!classroom) return NextResponse.json({ error: 'Invalid code' }, { status: 404 });

    await db.collection('classrooms').updateOne(
        { _id: classroom._id },
        { $addToSet: { members: user._id } }
    );

    return NextResponse.json({ success: true, classroomId: classroom._id });
}
