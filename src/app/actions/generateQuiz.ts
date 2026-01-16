'use server';

import { z } from 'zod';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import clientPromise from '@/lib/mongodb';

const quizSchema = z.object({
    question: z.string().min(5),
    options: z.array(z.string().min(1)).min(3).max(6),
    correctAnswerIndex: z.number().int().min(0),
    explanation: z.string().min(5),
    tags: z.array(z.string().min(1)).min(1).max(6),
});

export async function generateQuiz(params: { topic?: string; rawText?: string }) {
    const topic = params.topic?.trim();
    const rawText = params.rawText?.trim();

    if (!topic && !rawText) {
        return { success: false, error: 'Provide a topic or rawText.' } as const;
    }

    const prompt = [
        'You are an expert educator creating a single high-quality multiple-choice question.',
        'Return a JSON object that matches the schema exactly.',
        topic ? `Topic: ${topic}` : null,
        rawText ? `Context: ${rawText}` : null,
        'Constraints:',
        '- Provide 4 answer options.',
        '- correctAnswerIndex must be the 0-based index of the correct option.',
        '- explanation should briefly justify why the correct option is right.',
        '- tags should include topic/subject keywords.',
    ].filter(Boolean).join('\n');

    const { object } = await generateObject({
        model: google('gemini-1.5-pro'),
        schema: quizSchema,
        prompt,
        temperature: 0.7,
    });

    const normalized = quizSchema.parse(object);
    const correctedIndex = normalized.correctAnswerIndex >= normalized.options.length
        ? 0
        : normalized.correctAnswerIndex;

    const quizDoc = {
        ...normalized,
        correctAnswerIndex: correctedIndex,
        topic: topic || null,
        sourceText: rawText || null,
        createdAt: new Date(),
        model: 'gemini-1.5-pro',
        provider: 'google',
    };

    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('quizzes').insertOne(quizDoc);

    return { success: true, quizId: result.insertedId.toString() } as const;
}
