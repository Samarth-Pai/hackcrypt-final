'use server';

import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type Gamification = {
    xp: number;
    level: number;
    badges: string[];
    achievements?: string[];
    completedLessons: number;
    streak?: {
        count: number;
        lastActive: Date | null;
    };
};

type Performance = {
    totalQuestions: number;
    totalCorrect: number;
    bySubject: Record<string, { total: number; correct: number }>;
    byDifficulty: Record<string, { total: number; correct: number }>;
};

type UserDoc = {
    _id: ObjectId;
    gamification: Gamification;
    performance?: Performance;
};

function getLevelFromXp(xp: number) {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
}

function computeBadges(gamification: Gamification, performance: Performance) {
    const badges = new Set(gamification.badges || []);
    const achievements = new Set(gamification.achievements || []);

    if (gamification.completedLessons >= 5) badges.add('Quest Starter');
    if (gamification.completedLessons >= 15) badges.add('Quest Apprentice');
    if (gamification.xp >= 500) badges.add('Rising Star');
    if (gamification.xp >= 1500) badges.add('Master Explorer');

    const accuracy = performance.totalQuestions > 0
        ? performance.totalCorrect / performance.totalQuestions
        : 0;
    if (performance.totalQuestions >= 20 && accuracy >= 0.8) achievements.add('Sharpshooter');
    if (performance.totalQuestions >= 50) achievements.add('Persistent Learner');

    return { badges: Array.from(badges), achievements: Array.from(achievements) };
}

function computeStreak(streak?: { count: number; lastActive: Date | null }) {
    const now = new Date();
    const lastActive = streak?.lastActive ? new Date(streak.lastActive) : null;
    let count = streak?.count || 0;

    if (!lastActive) {
        count = 1;
    } else {
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfLast = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
        const diffDays = Math.floor((startOfToday.getTime() - startOfLast.getTime()) / 86400000);

        if (diffDays === 1) {
            count += 1;
        } else if (diffDays > 1) {
            count = 1;
        }
    }

    return { count, lastActive: now };
}

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

        const xpGained = score * 10;
        const userId = new ObjectId(payload.userId as string);

        await db.collection('users').updateOne(
            { _id: userId, 'gamification.completedLessons': { $type: 'array' } },
            { $set: { 'gamification.completedLessons': 0 } }
        );

        const updatedUserResult = await db.collection<UserDoc>('users').findOneAndUpdate(
            { _id: userId },
            {
                $inc: {
                    'gamification.xp': xpGained,
                    'gamification.completedLessons': 1,
                    'performance.totalQuestions': totalQuestions,
                    'performance.totalCorrect': score,
                },
                $setOnInsert: {
                    'performance.bySubject': {},
                    'performance.byDifficulty': {},
                },
            },
            { returnDocument: 'after' }
        );

        const updatedUser = updatedUserResult || null;
        if (updatedUser) {
            const currentXp = updatedUser.gamification?.xp ?? 0;
            const currentLevel = updatedUser.gamification?.level ?? 1;
            const newLevel = getLevelFromXp(currentXp);

            const performance: Performance = updatedUser.performance || {
                totalQuestions: 0,
                totalCorrect: 0,
                bySubject: {},
                byDifficulty: {},
            };

            const { badges, achievements } = computeBadges(updatedUser.gamification, performance);
            const streak = computeStreak(updatedUser.gamification.streak);

            const updates: Record<string, unknown> = {
                'gamification.badges': badges,
                'gamification.achievements': achievements,
                'gamification.streak': streak,
            };

            if (newLevel > currentLevel) {
                updates['gamification.level'] = newLevel;
            }

            await db.collection('users').updateOne({ _id: userId }, { $set: updates });
        }

        return { success: true, xpGained };
    } catch (error) {
        console.error('Error saving quiz result:', error);
        return { success: false, error: 'Failed to save result' };
    }
}
