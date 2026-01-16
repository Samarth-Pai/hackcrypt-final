import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getSessionUserDoc } from '@/lib/session';

function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i += 1) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

export async function GET() {
    const data = await getSessionUserDoc();
    if (!data) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { user, session } = data;
    const role = user.role || session.role || 'student';

    const client = await clientPromise;
    const db = client.db();

    const filter = role === 'teacher'
        ? { teacherId: user._id }
        : { members: user._id };

    const classrooms = await db.collection('classrooms').find(filter).toArray();

    return NextResponse.json({ classrooms });
}

export async function POST(request: Request) {
    const data = await getSessionUserDoc();
    if (!data) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { user, session } = data;
    const role = user.role || session.role || 'student';
    if (role !== 'teacher' && role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db();

    const classroom = {
        name,
        code: generateCode(),
        teacherId: user._id,
        members: [user._id],
        createdAt: new Date(),
    };

    const result = await db.collection('classrooms').insertOne(classroom);

    return NextResponse.json({
        success: true,
        classroom: { ...classroom, _id: result.insertedId },
    });
}
