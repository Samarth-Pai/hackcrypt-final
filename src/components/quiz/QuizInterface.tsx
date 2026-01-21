'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Loader2, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ChatTutor from '@/components/chat/ChatTutor';

interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
}

interface QuizInterfaceProps {
    questions: Question[];
}

interface FeedbackItem {
    questionId: string;
    correct: boolean;
    correctAnswer: string | null;
    explanation: string | null;
}

export default function QuizInterface({ questions }: QuizInterfaceProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [xpGained, setXpGained] = useState(0);
    const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
    const [answers, setAnswers] = useState<{ questionId: string; selectedOption: string | null }[]>([]);
    const router = useRouter();

    const currentQuestion = questions[currentQuestionIndex];

    const finishQuiz = useCallback(async () => {
        if (!currentQuestion) return;

        setIsSubmitting(true);
        // Optimistic completion state
        setIsCompleted(true);
        // Score state is updated immediately on click, so `score` is current.

        // Trigger confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#2E7D32', '#C6FF00', '#FFD600'] // Theme colors
        });

        const finalAnswers = (() => {
            const existing = answers.find((a) => a.questionId === currentQuestion.id);
            if (existing) return answers;
            return [...answers, { questionId: currentQuestion.id, selectedOption }];
        })();

        const response = await fetch('/api/quiz/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers: finalAnswers }),
        });

        if (response.ok) {
            const result = await response.json();
            setXpGained(result.xpGained || 0);
            setFeedback(result.feedback || []);
            if (typeof result.score === 'number') {
                setScore(result.score);
            }
        }
        setIsSubmitting(false);
    }, [answers, currentQuestion, selectedOption]);

    const handleNextQuestion = useCallback(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedOption(null);
            setIsCorrect(null);
            setTimeLeft(15);
        } else {
            finishQuiz();
        }
    }, [currentQuestionIndex, finishQuiz, questions.length]);

    const handleOptionSelect = useCallback((option: string | null) => {
        if (!currentQuestion || selectedOption !== null) return; // Prevent multiple selects

        setSelectedOption(option);

        setAnswers((prev) => {
            const next = [...prev];
            const existingIndex = next.findIndex((a) => a.questionId === currentQuestion.id);
            if (existingIndex >= 0) {
                next[existingIndex] = { questionId: currentQuestion.id, selectedOption: option };
                return next;
            }
            next.push({ questionId: currentQuestion.id, selectedOption: option });
            return next;
        });

        const correct = option === currentQuestion.correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            setScore((prev) => prev + 1);
        }

        // Wait for animation frame before moving next
        setTimeout(() => {
            handleNextQuestion();
        }, 1500); // 1.5s delay for feedback
    }, [currentQuestion, handleNextQuestion, selectedOption]);

    const handleTimeUp = useCallback(() => {
        handleOptionSelect(null); // Treat timeout as incorrect/no selection
    }, [handleOptionSelect]);

    // Timer Effect
    useEffect(() => {
        if (isCompleted || selectedOption !== null) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestionIndex, handleTimeUp, isCompleted, selectedOption]);

    if (isCompleted) {
        const rating = score >= 9
            ? 'S'
            : score >= 8
                ? 'A'
                : score >= 6
                    ? 'B'
                    : score >= 4
                        ? 'C'
                        : 'D';
        const ratingMessage = score >= 8
            ? 'Congratulations! You nailed this quest.'
            : score >= 6
                ? 'Solid effort. A little more practice will level you up.'
                : 'Keep going. Review the concepts and try again.';
        const attemptedContext = answers
            .map((answer, index) => {
                const question = questions.find((q) => q.id === answer.questionId);
                const feedbackItem = feedback.find((item) => item.questionId === answer.questionId);
                const correctAnswer = feedbackItem?.correctAnswer || question?.correctAnswer || 'N/A';
                const explanation = feedbackItem?.explanation || 'No explanation available.';
                return [
                    `Q${index + 1}: ${question?.text || answer.questionId}`,
                    `Your answer: ${answer.selectedOption ?? 'No answer'}`,
                    `Correct: ${correctAnswer}`,
                    `Explanation: ${explanation}`,
                ].join('\n');
            })
            .join('\n\n');

        return (
            <div className="flex flex-col items-center justify-center p-8 bg-earth text-[#ededed] rounded-xl shadow-2xl max-w-2xl mx-auto mt-10 border border-forest">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <Trophy className="w-24 h-24 text-sun mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-2 text-growth">Quiz Completed!</h2>
                    <p className="text-xl mb-2">You scored {score + 1} / {questions.length}</p>
                    <p className="text-sm text-gray-300 mb-4">Rating: <span className="text-sun font-bold">{rating}</span></p>

                    {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2 text-growth">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>Saving results...</span>
                        </div>
                    ) : (
                        <div className="bg-forest/20 p-6 rounded-lg border border-forest">
                            <p className="text-2xl font-bold text-sun">+{xpGained} XP</p>
                            <p className="text-sm text-gray-300">{ratingMessage}</p>
                            {feedback.length > 0 && (
                                <div className="mt-6 space-y-3 text-left">
                                    <p className="text-sm text-growth font-bold">Review</p>
                                    {feedback.filter((item) => !item.correct).map((item) => (
                                        <div key={item.questionId} className="p-3 bg-earth/70 rounded-lg border border-[#5D4037]">
                                            <p className="text-xs text-red-300">Correct: {item.correctAnswer || 'N/A'}</p>
                                            {item.explanation && (
                                                <p className="text-xs text-gray-300 mt-1">{item.explanation}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-6 space-y-3 text-left">
                                <p className="text-sm text-growth font-bold">All Attempts</p>
                                {questions.map((question, index) => {
                                    const userAnswer = answers.find((a) => a.questionId === question.id)?.selectedOption ?? null;
                                    return (
                                        <div key={question.id} className="p-4 bg-earth/70 rounded-lg border border-[#5D4037]">
                                            <p className="text-xs text-gray-400 mb-2">Q{index + 1}</p>
                                            <p className="text-sm text-white mb-2">{question.text}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {question.options.map((option) => {
                                                    const isCorrectOption = option === question.correctAnswer;
                                                    const isUserChoice = option === userAnswer;
                                                    let optionClass = 'text-xs px-3 py-2 rounded border ';

                                                    if (isCorrectOption) {
                                                        optionClass += 'bg-forest/70 border-growth text-white';
                                                    } else if (isUserChoice) {
                                                        optionClass += 'bg-red-900/70 border-red-500 text-white';
                                                    } else {
                                                        optionClass += 'bg-[#1B1B1B] border-[#5D4037] text-gray-400';
                                                    }

                                                    return (
                                                        <div key={option} className={optionClass}>
                                                            {option}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2">Your answer: {userAnswer ?? 'No answer'}</p>
                                            <p className="text-xs text-gray-400">Correct: {question.correctAnswer}</p>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-6">
                                <ChatTutor context={attemptedContext} />
                            </div>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="mt-6 px-6 py-2 bg-forest hover:bg-[#1B5E20] text-white rounded-full transition-colors font-bold"
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-earth/90 text-[#ededed] rounded-xl shadow-xl backdrop-blur-sm border border-[#5D4037]">
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2 text-growth">
                    <span>Question {currentQuestionIndex + 1} / {questions.length}</span>
                    <span>Time: {timeLeft}s</span>
                </div>
                <div className="h-4 bg-[#1B1B1B] rounded-full overflow-hidden border border-[#5D4037]">
                    <motion.div
                        className="h-full bg-forest"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <motion.div
                    className="h-1 bg-sun mt-1"
                    initial={{ width: "100%" }}
                    animate={{ width: `${(timeLeft / 15) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-2xl font-bold mb-8 text-white">{currentQuestion.text}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.options.map((option) => {
                            let optionClass = "p-4 rounded-lg border-2 text-left transition-all font-medium text-lg ";

                            if (selectedOption === option) {
                                if (isCorrect) {
                                    optionClass += "bg-forest border-growth text-white";
                                } else if (isCorrect === false) {
                                    optionClass += "bg-red-900/80 border-red-500 text-white";
                                } else {
                                    optionClass += "bg-[#5D4037] border-sun text-white";
                                }
                            } else if (selectedOption !== null && option === currentQuestion.correctAnswer) {
                                // Show correct answer if user picked wrong
                                optionClass += "bg-forest/50 border-forest text-gray-200";
                            } else {
                                optionClass += "bg-[#1B1B1B] border-transparent hover:border-sun hover:bg-[#202020] text-gray-300";
                            }

                            return (
                                <motion.button
                                    key={option}
                                    whileHover={!selectedOption ? { scale: 1.02 } : {}}
                                    whileTap={!selectedOption ? { scale: 0.98 } : {}}
                                    onClick={() => handleOptionSelect(option)}
                                    disabled={selectedOption !== null}
                                    className={optionClass}
                                >
                                    <div className="flex items-center justify-between">
                                        {option}
                                        {selectedOption === option && isCorrect && <CheckCircle className="text-growth" />}
                                        {selectedOption === option && isCorrect === false && <XCircle className="text-red-400" />}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
