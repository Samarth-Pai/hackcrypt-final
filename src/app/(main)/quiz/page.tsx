import QuizInterface from '@/components/quiz/QuizInterface';
import { fetchAdaptiveQuestions } from '@/lib/quiz';
import { getSessionUserDoc } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function QuizPage() {
    const data = await getSessionUserDoc();
    const performance = data?.user?.performance;
    const accuracy = performance && performance.totalQuestions > 0
        ? performance.totalCorrect / performance.totalQuestions
        : 0.65;

    const questions = await fetchAdaptiveQuestions({
        subject: 'Computer Science',
        limit: 5,
        accuracy,
    });

    const formattedQuestions = questions.map((q) => ({
        id: q._id?.toString() || '',
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
    }));

    return (
        <div className="min-h-screen bg-earth bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-[#4E342E] via-earth to-[#2E1E1A] p-4 flex flex-col items-center">
            <div className="w-full max-w-3xl mb-8 flex justify-between items-center text-[#ededed] mt-8">
                <h1 className="text-2xl font-bold text-growth">Quest: CS Fundamentals</h1>
                <span className="bg-forest px-3 py-1 rounded-full text-xs font-bold">Reward: 15-50 XP</span>
            </div>

            <div className="w-full">
                <QuizInterface questions={formattedQuestions} />
            </div>
        </div>
    );
}
