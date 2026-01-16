'use client';

import { useState } from 'react';
import Flashcards, { Flashcard } from '@/components/syllabus/Flashcards';
import MatchTheFollowing, { MatchPair } from '@/components/syllabus/MatchTheFollowing';
import QuizInterface from '@/components/quiz/QuizInterface';

interface SyllabusDetailProps {
    slug: string;
    title: string;
    description: string;
    flashcards: Flashcard[];
    questions: Array<{ id: string; text: string; options: string[]; correctAnswer: string }>;
    matchPairs: MatchPair[];
}

export default function SyllabusDetail({ slug, title, description, flashcards, questions, matchPairs }: SyllabusDetailProps) {
    const [showQuiz, setShowQuiz] = useState(false);

    return (
        <div className="space-y-6">
            <div className="glass-cosmic p-6 rounded-xl border border-cyan-500/30">
                <h1 className="text-2xl font-bold text-cyan-200 text-glow mb-2">{title}</h1>
                <p className="text-sm text-slate-300">{description}</p>
            </div>

            <Flashcards cards={flashcards} syllabusSlug={slug} />

            {matchPairs.length > 0 && <MatchTheFollowing pairs={matchPairs} />}

            <div className="glass-cosmic p-6 rounded-xl border border-cyan-500/30">
                <button
                    onClick={() => setShowQuiz((prev) => !prev)}
                    className="px-4 py-2 bg-cyan-500/20 text-cyan-100 rounded-full border border-cyan-500/40 hover:border-violet-500/70 hover:text-white transition-colors"
                >
                    {showQuiz ? 'Hide Quiz' : 'Start Quiz'}
                </button>
            </div>

            {showQuiz && <QuizInterface questions={questions} />}
        </div>
    );
}
