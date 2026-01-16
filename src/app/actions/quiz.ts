'use server';

import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function saveQuizResult(score: number, totalQuestions: number) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session')?.value;

        if (!token) {
            return { success: false, error: 'Not authenticated' };
        }

        const payload = await verifyJWT(token);
        if (!payload || !payload.userId) {
            return { success: false, error: 'Invalid session' };
        }

        const client = await clientPromise;
        const db = client.db();

        // Calculate XP gained (e.g., 10 XP per correct answer)
        const xpGained = score * 10;
        const userId = new ObjectId(payload.userId as string);

        // Update user stats and get the new document
        const updatedUser = await db.collection('users').findOneAndUpdate(
            { _id: userId },
            {
                $inc: {
                    'gamification.xp': xpGained,
                    'gamification.completedLessons': 1
                }
            },
            { returnDocument: 'after' }
        );

        if (updatedUser) {
            const currentXp = updatedUser.gamification.xp;

            // New Level Logic: Level = Math.floor(Math.sqrt(totalXP / 100)) + 1
            const newLevel = Math.floor(Math.sqrt(currentXp / 100)) + 1;

            if (newLevel > updatedUser.gamification.level) {
                await db.collection('users').updateOne(
                    { _id: userId },
                    { $set: { 'gamification.level': newLevel } }
                );
            }
        }

        return { success: true, xpGained };
    } catch (error) {
        console.error('Error saving quiz result:', error);
        return { success: false, error: 'Failed to save result' };
    }
}
