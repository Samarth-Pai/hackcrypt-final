'use client';

import { useState } from 'react';
import Flashcards, { Flashcard } from '@/components/syllabus/Flashcards';
import QuizInterface from '@/components/quiz/QuizInterface';

interface SyllabusDetailProps {
    title: string;
    description: string;
    flashcards: Flashcard[];
    questions: Array<{ id: string; text: string; options: string[]; correctAnswer: string }>;
}

export default function SyllabusDetail({ title, description, flashcards, questions }: SyllabusDetailProps) {
    const [showQuiz, setShowQuiz] = useState(false);

    return (
        <div className="space-y-6">
            <div className="bg-[#5D4037]/40 p-6 rounded-xl border border-[#5D4037]">
                <h1 className="text-2xl font-bold text-growth mb-2">{title}</h1>
                <p className="text-sm text-gray-300">{description}</p>
            </div>

            <Flashcards cards={flashcards} />

            <div className="bg-[#3E2723]/70 p-6 rounded-xl border border-[#5D4037]">
                <button
                    onClick={() => setShowQuiz((prev) => !prev)}
                    className="px-4 py-2 bg-forest text-white rounded-full hover:bg-[#1B5E20]"
                >
                    {showQuiz ? 'Hide Quiz' : 'Start Quiz'}
                </button>
            </div>

            {showQuiz && <QuizInterface questions={questions} />}
        </div>
    );
}
