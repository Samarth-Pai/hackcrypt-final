'use server';

import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSessionUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function updateUserAvatar(avatarConfig: any) {
    const session = await getSessionUser();
    if (!session || !session.userId) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const client = await clientPromise;
        const db = client.db();

        await db.collection('users').updateOne(
            { _id: new ObjectId(session.userId) },
            { $set: { avatarConfig } }
        );

        revalidatePath('/profile');
        revalidatePath(`/profile/${session.userId}`);

        return { success: true };
    } catch (error) {
        console.error('Failed to update avatar:', error);
        return { success: false, error: 'Failed to update avatar' };
    }
}

export async function getUsersDetails(userIds: string[]) {
    try {
        const client = await clientPromise;
        const db = client.db();

        const validObjectIds = userIds
            .map(id => {
                try {
                    return new ObjectId(id);
                } catch (e) {
                    console.error(`Invalid ObjectId: ${id}`);
                    return null;
                }
            })
            .filter((id): id is ObjectId => id !== null);

        if (validObjectIds.length === 0) return [];

        const users = await db.collection('users').find(
            { _id: { $in: validObjectIds } },
            { projection: { name: 1, avatarConfig: 1, title: 1, _id: 1 } }
        ).toArray();

        // Serialize ObjectIds
        return users.map(user => ({
            ...user,
            _id: user._id.toString()
        }));
    } catch (error) {
        console.error('Failed to fetch user details:', error);
        return [];
    }
}
