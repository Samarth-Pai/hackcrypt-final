declare module 'ai' {
    import type { ZodTypeAny } from 'zod';

    export function generateObject<T>(params: {
        model: unknown;
        schema: ZodTypeAny;
        prompt: string;
        temperature?: number;
    }): Promise<{ object: T }>;
}

declare module '@ai-sdk/google' {
    export function google(model: string): unknown;
}
