declare module 'ai' {
    import type { ZodTypeAny } from 'zod';

    export function generateObject<T>(params: {
        model: unknown;
        schema: ZodTypeAny;
        prompt: string;
        temperature?: number;
    }): Promise<{ object: T }>;

    export function generateText(params: {
        model: unknown;
        system?: string;
        prompt?: string;
        messages?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
        temperature?: number;
    }): Promise<{ text: string }>;
}

declare module '@ai-sdk/google' {
    export function google(model: string): unknown;
}
