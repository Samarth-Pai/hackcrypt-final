import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSessionUserDoc } from '@/lib/session';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const data = await getSessionUserDoc();
    if (!data) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { user, session } = data;
    const role = user.role || session.role || 'student';
    if (role !== 'teacher' && role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db();

    const classroom = await db.collection('classrooms').findOne({ _id: new ObjectId(params.id) });
    if (!classroom) return NextResponse.json({ error: 'Classroom not found' }, { status: 404 });

    if (!classroom.teacherId?.equals(user._id)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    type MemberDoc = {
        _id: ObjectId;
        name?: string;
        performance?: {
            totalQuestions?: number;
            totalCorrect?: number;
        };
        gamification?: {
            xp?: number;
            level?: number;
        };
    };

    const members = await db.collection<MemberDoc>('users')
        .find({ _id: { $in: classroom.members } })
        .project({ name: 1, performance: 1, gamification: 1 })
        .toArray();

    const totals = members.reduce(
        (acc, member) => {
            const perf = member.performance || {};
            acc.totalQuestions += perf.totalQuestions || 0;
            acc.totalCorrect += perf.totalCorrect || 0;
            acc.totalXp += member.gamification?.xp || 0;
            return acc;
        },
        { totalQuestions: 0, totalCorrect: 0, totalXp: 0 }
    );

    const accuracy = totals.totalQuestions > 0 ? totals.totalCorrect / totals.totalQuestions : 0;
    const avgXp = members.length > 0 ? totals.totalXp / members.length : 0;

    return NextResponse.json({
        classroom: { id: classroom._id, name: classroom.name, code: classroom.code },
        stats: {
            members: members.length,
            totalQuestions: totals.totalQuestions,
            totalCorrect: totals.totalCorrect,
            accuracy,
            avgXp,
        },
        students: members.map((m) => ({
            id: m._id,
            name: m.name,
            xp: m.gamification?.xp || 0,
            level: m.gamification?.level || 1,
            totalQuestions: m.performance?.totalQuestions || 0,
            totalCorrect: m.performance?.totalCorrect || 0,
        })),
    });
}
