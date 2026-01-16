import { NextResponse } from 'next/server';
import { calculateNextDifficulty, fetchAdaptiveQuestions } from '@/lib/quiz';
import { getSessionUserDoc } from '@/lib/session';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;
    const difficulty = searchParams.get('difficulty') ? Number(searchParams.get('difficulty')) : undefined;

    const data = await getSessionUserDoc();
    const performance = data?.user?.performance;
    const accuracy = performance && performance.totalQuestions > 0
        ? performance.totalCorrect / performance.totalQuestions
        : 0.65;

    const rankResult = data?.user?._id
        ? await calculateNextDifficulty({
            userId: data.user._id,
            hiddenDifficultyRank: performance?.hiddenDifficultyRank,
            subject: subject || undefined,
        })
        : { difficultyRank: undefined, movingAverage: accuracy, foundationTopics: [] };

    const difficultyFromRank = typeof rankResult.difficultyRank === 'number'
        ? rankResult.difficultyRank
        : undefined;

    const questions = await fetchAdaptiveQuestions({
        subject,
        limit,
        accuracy,
        difficulty: difficulty ?? difficultyFromRank,
    });

    return NextResponse.json({
        subject: subject || 'Mixed',
        difficulty: (difficulty ?? difficultyFromRank) ?? null,
        movingAverageAccuracy: rankResult.movingAverage,
        foundationTopics: rankResult.foundationTopics,
        questions,
    });
}
