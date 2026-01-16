import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(request: Request) {
    const body = await request.json();
    const context: string = body?.context || '';
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = body?.messages || [];

    const systemPrompt = [
        'You are a helpful tutor who explains answers step-by-step and encourages learning.',
        'Keep responses concise and friendly.',
        'Return plain text only. Do not use markdown, lists, or code blocks.',
        context ? `Quiz context:\n${context}` : null,
    ].filter(Boolean).join('\n');

    const { text } = await generateText({
        model: google('gemini-2.5-pro'),
        system: systemPrompt,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature: 0.4,
    });

    const sanitized = text
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]*)`/g, '$1')
        .replace(/[#>*_\-]{1,3}\s*/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    return NextResponse.json({ reply: sanitized });
}
