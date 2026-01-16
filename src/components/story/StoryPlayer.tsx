'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';
import { Story, StoryQuestion } from '@/lib/stories';

const formatOptions = (question: StoryQuestion) => {
    if (question.type === 'true_false') {
        return ['True', 'False'];
    }
    return question.options || [];
};

export default function StoryPlayer({ story }: { story: Story }) {
    const router = useRouter();
    const steps = useMemo(() => {
        return [
            ...story.cards.map((content, index) => ({ type: 'card' as const, content, id: `card-${index}` })),
            ...story.questions.map((question) => ({ type: 'question' as const, question, id: question.id })),
        ];
    }, [story]);

    const [stepIndex, setStepIndex] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const step = steps[stepIndex];
    const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

    const handleAnswer = async (option: string) => {
        if (submitted || step?.type !== 'question') return;

        setSelected(option);
        setSubmitted(true);

        const isCorrect = option === step.question.correctAnswer;
        if (isCorrect) setCorrectCount((prev) => prev + 1);

        await fetch('/api/story/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                storyId: story.id,
                correct: isCorrect,
                progress: Math.round(((stepIndex + 1) / steps.length) * 100),
                completed: stepIndex === steps.length - 1,
            }),
        });
    };

    const nextStep = () => {
        if (stepIndex < steps.length - 1) {
            setStepIndex((prev) => prev + 1);
            setSelected(null);
            setSubmitted(false);
            return;
        }
        setSubmitted(true);
        router.push('/story');
    };

    return (
        <div className="bg-[#3E2723]/70 p-6 rounded-2xl border border-[#5D4037] space-y-6">
            <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Progress {progress}%</span>
                <span>{stepIndex + 1} / {steps.length}</span>
            </div>
            <div className="h-2 bg-[#1B1B1B] rounded-full overflow-hidden">
                <div className="h-full bg-growth" style={{ width: `${progress}%` }} />
            </div>

            {step.type === 'card' ? (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-growth">Story Intel</h2>
                    <p className="text-sm text-gray-200 whitespace-pre-line leading-relaxed">{step.content}</p>
                    <button
                        onClick={nextStep}
                        className="px-4 py-2 bg-forest text-white rounded-full hover:bg-[#1B5E20]"
                    >
                        {stepIndex === steps.length - 1 ? 'Finish Story' : 'Continue'}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-growth">Knowledge Check</h2>
                    <p className="text-sm text-gray-200">{step.question.prompt}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {formatOptions(step.question).map((option) => {
                            const isCorrect = submitted && option === step.question.correctAnswer;
                            const isWrong = submitted && selected === option && !isCorrect;
                            return (
                                <button
                                    key={option}
                                    onClick={() => handleAnswer(option)}
                                    disabled={submitted}
                                    className={`px-3 py-2 rounded-lg border text-sm transition-colors ${isCorrect ? 'bg-forest/70 border-growth text-white' : isWrong ? 'bg-red-900/70 border-red-500 text-white' : 'bg-[#1B1B1B] border-[#5D4037] text-gray-200 hover:border-sun'}`}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                    {submitted && (
                        <div className="flex items-center gap-2 text-xs">
                            {selected === step.question.correctAnswer ? (
                                <span className="text-growth flex items-center gap-2"><CheckCircle size={14} /> Correct</span>
                            ) : (
                                <span className="text-red-300 flex items-center gap-2"><XCircle size={14} /> Incorrect. Correct: {step.question.correctAnswer}</span>
                            )}
                        </div>
                    )}
                    <button
                        onClick={nextStep}
                        disabled={!submitted}
                        className="px-4 py-2 bg-forest text-white rounded-full hover:bg-[#1B5E20] disabled:opacity-50"
                    >
                        {stepIndex === steps.length - 1 ? 'Finish Story' : 'Next'}
                    </button>
                </div>
            )}

            {stepIndex === steps.length - 1 && submitted && (
                <div className="mt-4 bg-forest/20 border border-forest rounded-lg p-4 text-sm text-gray-200">
                    Story complete. You answered {correctCount} / {story.questions.length} correctly.
                </div>
            )}
        </div>
    );
}
