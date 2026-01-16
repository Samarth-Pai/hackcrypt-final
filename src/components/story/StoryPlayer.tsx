'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';
import { Story, StoryCard, StoryQuestion } from '@/lib/stories';

const formatOptions = (question: StoryQuestion) => {
    if (question.type === 'true_false') {
        return ['True', 'False'];
    }
    return question.options || [];
};

export default function StoryPlayer({ story }: { story: Story }) {
    const router = useRouter();
    const steps = useMemo(() => {
        const cardSteps = story.cards.map((card, index) => {
            if (typeof card === 'string') {
                return { type: 'card' as const, content: card, id: `card-${index}` };
            }

            const typedCard = card as StoryCard;
            return {
                type: 'card' as const,
                content: typedCard.content,
                choices: typedCard.choices,
                id: typedCard.id || `card-${index}`,
            };
        });

        return [
            ...cardSteps,
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

    const goToStep = (nextId: string) => {
        const nextIndex = steps.findIndex((item) => item.id === nextId);
        if (nextIndex === -1) return;
        setStepIndex(nextIndex);
        setSelected(null);
        setSubmitted(false);
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
        <div className="glass-cosmic p-6 rounded-2xl border border-cyan-500/30 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Progress {progress}%</span>
                <span>{stepIndex + 1} / {steps.length}</span>
            </div>
            <div className="h-2 bg-[#0F061A] rounded-full overflow-hidden border border-cyan-500/20">
                <div className="h-full bg-cyan-400" style={{ width: `${progress}%` }} />
            </div>

            {step.type === 'card' ? (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-cyan-200">Story Intel</h2>
                    <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">{step.content}</p>
                    {step.choices && step.choices.length > 0 ? (
                        <div className="space-y-3">
                            <p className="text-xs uppercase tracking-widest text-slate-400">Choose a path</p>
                            <div className="flex flex-wrap gap-3">
                                {step.choices.map((choice) => (
                                    <button
                                        key={choice.nextId}
                                        onClick={() => goToStep(choice.nextId)}
                                        className="px-4 py-2 bg-cyan-500/20 text-cyan-100 rounded-full border border-cyan-500/40 hover:border-violet-500/70 hover:text-white transition-colors"
                                    >
                                        {choice.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={nextStep}
                            className="px-4 py-2 bg-cyan-500/20 text-cyan-100 rounded-full border border-cyan-500/40 hover:border-violet-500/70 hover:text-white transition-colors"
                        >
                            {stepIndex === steps.length - 1 ? 'Finish Story' : 'Continue'}
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-cyan-200">Knowledge Check</h2>
                    <p className="text-sm text-slate-200">{step.question.prompt}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {formatOptions(step.question).map((option) => {
                            const isCorrect = submitted && option === step.question.correctAnswer;
                            const isWrong = submitted && selected === option && !isCorrect;
                            return (
                                <button
                                    key={option}
                                    onClick={() => handleAnswer(option)}
                                    disabled={submitted}
                                    className={`px-3 py-2 rounded-lg border text-sm transition-colors ${isCorrect ? 'bg-cyan-500/30 border-cyan-400 text-white' : isWrong ? 'bg-red-900/70 border-red-500 text-white' : 'bg-[#0F061A] border-cyan-500/30 text-slate-200 hover:border-violet-500/60'}`}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                    {submitted && (
                        <div className="flex items-center gap-2 text-xs">
                            {selected === step.question.correctAnswer ? (
                                <span className="text-cyan-200 flex items-center gap-2"><CheckCircle size={14} /> Correct</span>
                            ) : (
                                <span className="text-red-300 flex items-center gap-2"><XCircle size={14} /> Incorrect. Correct: {step.question.correctAnswer}</span>
                            )}
                        </div>
                    )}
                    <button
                        onClick={nextStep}
                        disabled={!submitted}
                        className="px-4 py-2 bg-cyan-500/20 text-cyan-100 rounded-full border border-cyan-500/40 hover:border-violet-500/70 hover:text-white transition-colors disabled:opacity-50"
                    >
                        {stepIndex === steps.length - 1 ? 'Finish Story' : 'Next'}
                    </button>
                </div>
            )}

            {stepIndex === steps.length - 1 && submitted && (
                <div className="mt-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 text-sm text-slate-200">
                    Story complete. You answered {correctCount} / {story.questions.length} correctly.
                </div>
            )}
        </div>
    );
}
