import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSessionUser } from '@/lib/session';
import type { QuestionDoc } from '@/lib/quiz';

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

function computeAwards(gamification: Gamification, performance: Performance) {
    const badges = new Set<string>(gamification?.badges || []);
    const achievements = new Set<string>(gamification?.achievements || []);

    if (gamification?.completedLessons >= 5) badges.add('Quest Starter');
    if (gamification?.completedLessons >= 15) badges.add('Quest Apprentice');
    if (gamification?.xp >= 500) badges.add('Rising Star');
    if (gamification?.xp >= 1500) badges.add('Master Explorer');

    const accuracy = performance?.totalQuestions > 0
        ? performance.totalCorrect / performance.totalQuestions
        : 0;
    if (performance?.totalQuestions >= 20 && accuracy >= 0.8) achievements.add('Sharpshooter');
    if (performance?.totalQuestions >= 50) achievements.add('Persistent Learner');

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

function normalizeKey(value: string) {
    return value.replace(/\./g, '_').replace(/\$/g, '').trim();
}

export async function POST(request: Request) {
    const session = await getSessionUser();
    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const answers: { questionId: string; selectedOption: string | null }[] = body?.answers || [];

    if (!Array.isArray(answers) || answers.length === 0) {
        return NextResponse.json({ error: 'Missing answers' }, { status: 400 });
    }

    const questionIds = answers.map((a) => new ObjectId(a.questionId));

    const client = await clientPromise;
    const db = client.db();

    const questions = await db
        .collection<QuestionDoc>('questions')
        .find({ _id: { $in: questionIds } })
        .toArray();

    const questionMap = new Map<string, QuestionDoc>(
        questions.map((q) => [q._id?.toString() || '', q])
    );

    let score = 0;
    const perSubjectInc: Record<string, { total: number; correct: number }> = {};
    const perDifficultyInc: Record<string, { total: number; correct: number }> = {};

    const feedback = answers.map((answer) => {
        const question = questionMap.get(answer.questionId);
        const isCorrect = question ? answer.selectedOption === question.correctAnswer : false;
        if (isCorrect) score += 1;

        if (question) {
            const subjectKey = normalizeKey(question.subject || 'General');
            const difficultyKey = String(question.difficulty || 1);

            perSubjectInc[subjectKey] = perSubjectInc[subjectKey] || { total: 0, correct: 0 };
            perSubjectInc[subjectKey].total += 1;
            perSubjectInc[subjectKey].correct += isCorrect ? 1 : 0;

            perDifficultyInc[difficultyKey] = perDifficultyInc[difficultyKey] || { total: 0, correct: 0 };
            perDifficultyInc[difficultyKey].total += 1;
            perDifficultyInc[difficultyKey].correct += isCorrect ? 1 : 0;
        }

        return {
            questionId: answer.questionId,
            correct: isCorrect,
            correctAnswer: question?.correctAnswer ?? null,
            explanation: question?.explanation ?? null,
        };
    });

    const totalQuestions = answers.length;
    const xpGained = score * 10;

    const userId = session.userId;

    await db.collection('users').updateOne(
        { _id: userId, 'gamification.completedLessons': { $type: 'array' } },
        { $set: { 'gamification.completedLessons': 0 } }
    );

    const perSubjectUpdates: Record<string, number> = {};
    const perDifficultyUpdates: Record<string, number> = {};

    Object.entries(perSubjectInc).forEach(([key, stats]) => {
        perSubjectUpdates[`performance.bySubject.${key}.total`] = stats.total;
        perSubjectUpdates[`performance.bySubject.${key}.correct`] = stats.correct;
    });

    Object.entries(perDifficultyInc).forEach(([key, stats]) => {
        perDifficultyUpdates[`performance.byDifficulty.${key}.total`] = stats.total;
        perDifficultyUpdates[`performance.byDifficulty.${key}.correct`] = stats.correct;
    });

    const updatedUserResult = await db.collection<UserDoc>('users').findOneAndUpdate(
        { _id: userId },
        {
            $inc: {
                'gamification.xp': xpGained,
                'gamification.completedLessons': 1,
                'performance.totalQuestions': totalQuestions,
                'performance.totalCorrect': score,
                ...perSubjectUpdates,
                ...perDifficultyUpdates,
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

        const performance = updatedUser.performance || {
            totalQuestions: 0,
            totalCorrect: 0,
            bySubject: {},
            byDifficulty: {},
        };

        const { badges, achievements } = computeAwards(updatedUser.gamification, performance);
        const streak = computeStreak(updatedUser.gamification.streak as { count: number; lastActive: Date | null } | undefined);

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

    return NextResponse.json({
        success: true,
        score,
        totalQuestions,
        xpGained,
        feedback,
    });
}
