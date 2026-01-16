import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export type SessionUser = {
    userId: ObjectId;
    email?: string;
    role?: string;
};

export async function getSessionUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if (!token) return null;

    const payload = await verifyJWT(token);
    if (!payload || !payload.userId) return null;

    return {
        userId: new ObjectId(payload.userId as string),
        email: payload.email as string | undefined,
        role: payload.role as string | undefined,
    } satisfies SessionUser;
}

export async function getSessionUserDoc() {
    const session = await getSessionUser();
    if (!session) return null;

    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection('users').findOne({ _id: session.userId });
    if (!user) return null;

    return { session, user };
}
