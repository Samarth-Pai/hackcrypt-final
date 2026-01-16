import { verifyJWT } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';

export async function getUserProfile() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) return null;

    const payload = await verifyJWT(token);
    if (!payload || !payload.userId) return null;

    try {
        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection('users').findOne({ _id: new ObjectId(payload.userId as string) });

        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return null;
    }
}
