import React from 'react';
import CosmicCard from '@/components/cosmic/CosmicCard';

export default function DesignDemoPage() {
    return (
        <div className="min-h-screen p-8 md:p-12 space-y-12">
            {/* Header Section */}
            <div className="space-y-4 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400 animate-pulse">
                    CosmicCypher Design System
                </h1>
                <p className="text-xl text-slate-400 font-light">
                    A futuristic, educational interface focused on clarity and immersion.
                </p>
            </div>

            {/* Typography Showcase */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-cyan-400 border-b border-cyan-500/20 pb-2 inline-block">
                    Typography (Outfit)
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold">Heading 1</h1>
                        <h2 className="text-3xl font-semibold">Heading 2</h2>
                        <h3 className="text-2xl font-medium">Heading 3</h3>
                        <p className="text-base text-slate-300">
                            Body text should be readable, crisp, and comfortable for long study sessions.
                            The contrast against the deep navy background is key.
                        </p>
                        <p className="text-sm text-slate-500">
                            Caption text for hints and metadata.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 rounded bg-slate-800/50 border border-slate-700">
                            <p className="font-mono text-cyan-400">Code Snippet / Mono</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Card System */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-violet-400 border-b border-violet-500/20 pb-2 inline-block">
                    Cosmic Cards
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                    <CosmicCard title="Standard Card">
                        <p className="text-slate-300">
                            A standard card for grouping content. Subtle border, glass background.
                        </p>
                    </CosmicCard>

                    <CosmicCard title="Cyan Glow" glow="cyan">
                        <p className="text-slate-300">
                            Used for emphasis or active states.
                        </p>
                        <div className="mt-4">
                            <button className="px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/20 transition-colors">
                                Action
                            </button>
                        </div>
                    </CosmicCard>

                    <CosmicCard title="Violet Nebula" glow="violet">
                        <p className="text-slate-300">
                            Used for creative or AI-related features.
                        </p>
                    </CosmicCard>
                </div>
            </section>

            {/* Utilities Showcase */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-blue-400 border-b border-blue-500/20 pb-2 inline-block">
                    Effects & Buttons
                </h2>
                <div className="flex flex-wrap gap-4">
                    <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all transform hover:-translate-y-0.5">
                        Primary Action
                    </button>

                    <button className="px-6 py-2.5 rounded-full border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors">
                        Secondary Action
                    </button>

                    <div className="px-6 py-2.5 rounded-full glass-cosmic text-slate-300">
                        Glassmorphism
                    </div>
                </div>
            </section>
        </div>
    );
}
