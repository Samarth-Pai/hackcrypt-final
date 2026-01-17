import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
        }

                const apiKey = process.env.OPENAI_API_KEY;
                if (!apiKey) {
                        const keywords = String(prompt)
                                .replace(/[^a-zA-Z0-9\s]/g, ' ')
                                .split(/\s+/)
                                .filter(Boolean)
                                .map((word) => word.toLowerCase())
                                .filter((word) => word.length > 4)
                                .slice(0, 5);

                        const hashString = (value: string) => {
                                let hash = 0;
                                for (let i = 0; i < value.length; i += 1) {
                                        hash = (hash << 5) - hash + value.charCodeAt(i);
                                        hash |= 0;
                                }
                                return Math.abs(hash);
                        };

                        const hash = hashString(prompt);
                        const hueA = hash % 360;
                        const hueB = (hash * 2) % 360;
                        const title = keywords.length > 0 ? keywords.join(' • ') : 'cosmic story visual';

                        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="hsl(${hueA}, 80%, 20%)"/>
            <stop offset="100%" stop-color="hsl(${hueB}, 80%, 30%)"/>
        </linearGradient>
        <radialGradient id="glow" cx="0.3" cy="0.2" r="0.8">
            <stop offset="0%" stop-color="rgba(255,255,255,0.6)"/>
            <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
    </defs>
    <rect width="1024" height="1024" fill="url(#bg)"/>
    <circle cx="260" cy="220" r="220" fill="url(#glow)"/>
    <circle cx="820" cy="740" r="280" fill="rgba(0, 243, 255, 0.08)"/>
    <circle cx="180" cy="780" r="120" fill="rgba(168, 85, 247, 0.14)"/>
    <rect x="120" y="680" width="784" height="190" rx="28" fill="rgba(5,5,20,0.6)" stroke="rgba(0,243,255,0.35)" stroke-width="2"/>
    <text x="160" y="740" fill="rgba(224,247,255,0.9)" font-size="28" font-family="Inter,Arial,sans-serif" letter-spacing="3">
        ${title.toUpperCase()}
    </text>
    <text x="160" y="790" fill="rgba(224,247,255,0.6)" font-size="16" font-family="Inter,Arial,sans-serif" letter-spacing="4">
        GENERATED PLACEHOLDER
    </text>
</svg>`;

                        const svgBase64 = Buffer.from(svg).toString('base64');

                        return NextResponse.json({
                                image: `data:image/svg+xml;base64,${svgBase64}`,
                                warning: 'Missing OPENAI_API_KEY. Serving dynamic placeholder.',
                        });
                }

        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-image-1',
                prompt: `${prompt}. Futuristic cinematic style, ultra-detailed, volumetric lighting, neon accents, space ambience, high contrast.`,
                size: '1024x1024',
                response_format: 'b64_json',
            }),
        });

        if (!response.ok) {
            let errorMessage = 'Image generation failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData?.error?.message || errorMessage;
            } catch {
                const errorText = await response.text();
                if (errorText) errorMessage = errorText;
            }
            return NextResponse.json({ error: errorMessage }, { status: 500 });
        }

        const data = await response.json();
        const imageBase64 = data?.data?.[0]?.b64_json;

        if (!imageBase64) {
            return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
        }

        return NextResponse.json({ image: `data:image/png;base64,${imageBase64}` });
    } catch (error) {
        console.error('Story image generation failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
