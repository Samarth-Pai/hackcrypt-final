'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
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
                image: typedCard.image,
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
    const [imageByStep, setImageByStep] = useState<Record<string, string>>({});
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const step = steps[stepIndex];
    const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

    useEffect(() => {
        let isMounted = true;
        const loadImage = async () => {
            if (!step) return;
            if (step.type === 'card' && step.image) {
                setImageByStep((prev) => ({ ...prev, [step.id]: step.image! }));
                return;
            }
            if (imageByStep[step.id]) return;

            setImageLoading(true);
            setImageError(null);

            const prompt = step.type === 'card'
                ? `Cinematic sci-fi story scene: ${step.content}`
                : `Cinematic sci-fi learning scene illustrating: ${step.question.prompt}`;

            try {
                const response = await fetch('/api/story/image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data?.error || 'Failed to generate image');
                }
                const nextImage = data?.image || data?.imageUrl;
                if (isMounted && nextImage) {
                    setImageByStep((prev) => ({ ...prev, [step.id]: nextImage }));
                }
            } catch (error) {
                if (isMounted) {
                    const message = error instanceof Error ? error.message : 'Unable to generate visual';
                    setImageError(message);
                }
            } finally {
                if (isMounted) {
                    setImageLoading(false);
                }
            }
        };

        loadImage();
        return () => {
            isMounted = false;
        };
    }, [imageByStep, step]);

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
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="glass-cosmic p-6 rounded-2xl border border-cyan-500/30 space-y-6"
        >
            <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Progress {progress}%</span>
                <span>{stepIndex + 1} / {steps.length}</span>
            </div>
            <div className="h-2 bg-[#0F061A] rounded-full overflow-hidden border border-cyan-500/20">
                <motion.div
                    className="h-full bg-cyan-400"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                />
            </div>

            <AnimatePresence mode="wait">
                {step.type === 'card' ? (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-6">
                            <div>
                                <h2 className="text-xl font-bold text-cyan-200">Story Intel</h2>
                                <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed mt-3">{step.content}</p>
                            </div>
                            <div className="relative rounded-2xl border border-cyan-500/20 bg-[#0F061A] overflow-hidden min-h-[220px]">
                                {imageByStep[step.id] && (
                                    <img
                                        src={imageByStep[step.id]}
                                        alt="Story visual"
                                        className="w-full h-full object-cover opacity-90"
                                    />
                                )}
                                {!imageByStep[step.id] && (
                                    <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.3em] text-cyan-400/70">
                                        {imageLoading ? 'Generating visual...' : imageError ?? 'Visual pending'}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F061A] via-transparent to-transparent" />
                            </div>
                        </div>
                        {step.choices && step.choices.length > 0 ? (
                            <div className="space-y-3">
                                <p className="text-xs uppercase tracking-widest text-slate-400">Choose a path</p>
                                <div className="flex flex-wrap gap-3">
                                    {step.choices.map((choice) => (
                                        <motion.button
                                            key={choice.nextId}
                                            onClick={() => goToStep(choice.nextId)}
                                            whileHover={{ y: -2, boxShadow: '0 0 18px rgba(34,211,238,0.25)' }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-4 py-2 bg-cyan-500/20 text-cyan-100 rounded-full border border-cyan-500/40 hover:border-violet-500/70 hover:text-white transition-colors"
                                        >
                                            {choice.label}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <motion.button
                                onClick={nextStep}
                                whileHover={{ y: -2, boxShadow: '0 0 18px rgba(34,211,238,0.25)' }}
                                whileTap={{ scale: 0.98 }}
                                className="px-4 py-2 bg-cyan-500/20 text-cyan-100 rounded-full border border-cyan-500/40 hover:border-violet-500/70 hover:text-white transition-colors"
                            >
                                {stepIndex === steps.length - 1 ? 'Finish Story' : 'Continue'}
                            </motion.button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-6">
                            <div>
                                <h2 className="text-xl font-bold text-cyan-200">Knowledge Check</h2>
                                <p className="text-sm text-slate-200 mt-3">{step.question.prompt}</p>
                            </div>
                            <div className="relative rounded-2xl border border-cyan-500/20 bg-[#0F061A] overflow-hidden min-h-[220px]">
                                {imageByStep[step.id] && (
                                    <img
                                        src={imageByStep[step.id]}
                                        alt="Story visual"
                                        className="w-full h-full object-cover opacity-90"
                                    />
                                )}
                                {!imageByStep[step.id] && (
                                    <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.3em] text-cyan-400/70">
                                        {imageLoading ? 'Generating visual...' : imageError ?? 'Visual pending'}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F061A] via-transparent to-transparent" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {formatOptions(step.question).map((option) => {
                                const isCorrect = submitted && option === step.question.correctAnswer;
                                const isWrong = submitted && selected === option && !isCorrect;
                                return (
                                    <motion.button
                                        key={option}
                                        onClick={() => handleAnswer(option)}
                                        disabled={submitted}
                                        whileHover={!submitted ? { y: -2, boxShadow: '0 0 18px rgba(99,102,241,0.2)' } : undefined}
                                        whileTap={!submitted ? { scale: 0.98 } : undefined}
                                        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${isCorrect ? 'bg-cyan-500/30 border-cyan-400 text-white' : isWrong ? 'bg-red-900/70 border-red-500 text-white' : 'bg-[#0F061A] border-cyan-500/30 text-slate-200 hover:border-violet-500/60'}`}
                                    >
                                        {option}
                                    </motion.button>
                                );
                            })}
                        </div>
                        {submitted && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-xs"
                            >
                                {selected === step.question.correctAnswer ? (
                                    <span className="text-cyan-200 flex items-center gap-2"><CheckCircle size={14} /> Correct</span>
                                ) : (
                                    <span className="text-red-300 flex items-center gap-2"><XCircle size={14} /> Incorrect. Correct: {step.question.correctAnswer}</span>
                                )}
                            </motion.div>
                        )}
                        <motion.button
                            onClick={nextStep}
                            disabled={!submitted}
                            whileHover={submitted ? { y: -2, boxShadow: '0 0 18px rgba(34,211,238,0.25)' } : undefined}
                            whileTap={submitted ? { scale: 0.98 } : undefined}
                            className="px-4 py-2 bg-cyan-500/20 text-cyan-100 rounded-full border border-cyan-500/40 hover:border-violet-500/70 hover:text-white transition-colors disabled:opacity-50"
                        >
                            {stepIndex === steps.length - 1 ? 'Finish Story' : 'Next'}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {stepIndex === steps.length - 1 && submitted && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 text-sm text-slate-200"
                >
                    Story complete. You answered {correctCount} / {story.questions.length} correctly.
                </motion.div>
            )}
        </motion.div>
    );
}
