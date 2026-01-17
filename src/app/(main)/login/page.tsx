'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Cpu, Lock } from 'lucide-react';
import CosmicCard from '@/components/cosmic/CosmicCard';
import CosmicBackground from '@/components/ui/CosmicBackground';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            router.push('/dashboard');
            return;
        }

        const data = await response.json();
        setError(data?.error || 'Login failed');
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <CosmicBackground />

            <div className="w-full max-w-md relative z-10">
                <CosmicCard glow="violet" title="IDENTITY VERIFICATION" className="shadow-2xl shadow-violet-900/40">
                    <div className="flex flex-col items-center mb-8">
                        <div className="p-4 rounded-full bg-violet-500/10 border border-violet-500/30 mb-4 animate-pulse">
                            <Cpu size={32} className="text-violet-400" />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-widest uppercase">
                            Edu Quest
                        </h1>
                        <p className="text-xs text-slate-400 uppercase tracking-widest mt-2">
                            Enter Credentials to Access
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold mb-2 block">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all placeholder:text-slate-600 font-mono text-sm"
                                placeholder="explorer@cosmic.net"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-violet-400 font-bold mb-2 block">
                                Passcode
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-violet-500 focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all placeholder:text-slate-600 font-mono text-sm pl-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-bold">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                        >
                            {isLoading ? 'Authenticating...' : 'Access Neural Core'}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-white/5">
                        <p className="text-xs text-slate-500">
                            No credentials?{' '}
                            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider transition-colors ml-1 hover:underline decoration-cyan-500/50">
                                Initialize New Identity
                            </Link>
                        </p>
                    </div>
                </CosmicCard>
            </div>
        </div>
    );
}
