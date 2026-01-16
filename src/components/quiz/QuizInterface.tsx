'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { saveQuizResult } from '@/app/actions/quiz';
import { Loader2, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
}

interface QuizInterfaceProps {
    questions: Question[];
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
    const router = useRouter();

    const currentQuestion = questions[currentQuestionIndex];

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
    }, [currentQuestionIndex, isCompleted, selectedOption]);

    const handleTimeUp = () => {
        handleOptionSelect(null); // Treat timeout as incorrect/no selection
    };

    const handleOptionSelect = (option: string | null) => {
        if (selectedOption !== null) return; // Prevent multiple selects

        setSelectedOption(option);

        const correct = option === currentQuestion.correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            setScore((prev) => prev + 1);
        }

        // Wait for animation frame before moving next
        setTimeout(() => {
            handleNextQuestion();
        }, 1500); // 1.5s delay for feedback
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedOption(null);
            setIsCorrect(null);
            setTimeLeft(15);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = async () => {
        setIsSubmitting(true);
        // Optimistic completion state
        setIsCompleted(true);
        const finalScore = isCorrect ? score + 1 : score; // Account for last question if correct (already updated in state but safe to calc)
        // Actually score state is updated immediately on click, so `score` is current.

        // Trigger confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#2E7D32', '#C6FF00', '#FFD600'] // Theme colors
        });

        const result = await saveQuizResult(score, questions.length);
        if (result.success) {
            setXpGained(result.xpGained || 0);
        }
        setIsSubmitting(false);
    };

    if (isCompleted) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-[#3E2723] text-[#ededed] rounded-xl shadow-2xl max-w-2xl mx-auto mt-10 border border-[#2E7D32]">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <Trophy className="w-24 h-24 text-[#FFD600] mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-2 text-[#C6FF00]">Quiz Completed!</h2>
                    <p className="text-xl mb-6">You scored {score} / {questions.length}</p>

                    {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2 text-[#C6FF00]">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>Saving results...</span>
                        </div>
                    ) : (
                        <div className="bg-[#2E7D32]/20 p-6 rounded-lg border border-[#2E7D32]">
                            <p className="text-2xl font-bold text-[#FFD600]">+{xpGained} XP</p>
                            <p className="text-sm text-gray-300">Great job cultivating your knowledge!</p>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="mt-6 px-6 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-full transition-colors font-bold"
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
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-[#3E2723]/90 text-[#ededed] rounded-xl shadow-xl backdrop-blur-sm border border-[#5D4037]">
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2 text-[#C6FF00]">
                    <span>Question {currentQuestionIndex + 1} / {questions.length}</span>
                    <span>Time: {timeLeft}s</span>
                </div>
                <div className="h-4 bg-[#1B1B1B] rounded-full overflow-hidden border border-[#5D4037]">
                    <motion.div
                        className="h-full bg-[#2E7D32]"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <motion.div
                    className="h-1 bg-[#FFD600] mt-1"
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
                                    optionClass += "bg-[#2E7D32] border-[#C6FF00] text-white";
                                } else if (isCorrect === false) {
                                    optionClass += "bg-red-900/80 border-red-500 text-white";
                                } else {
                                    optionClass += "bg-[#5D4037] border-[#FFD600] text-white";
                                }
                            } else if (selectedOption !== null && option === currentQuestion.correctAnswer) {
                                // Show correct answer if user picked wrong
                                optionClass += "bg-[#2E7D32]/50 border-[#2E7D32] text-gray-200";
                            } else {
                                optionClass += "bg-[#1B1B1B] border-transparent hover:border-[#FFD600] hover:bg-[#202020] text-gray-300";
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
                                        {selectedOption === option && isCorrect && <CheckCircle className="text-[#C6FF00]" />}
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
