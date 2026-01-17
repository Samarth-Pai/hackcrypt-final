'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import CosmicCard from '@/components/cosmic/CosmicCard';
import CosmicBackground from '@/components/ui/CosmicBackground';

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        const signupResponse = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        if (!signupResponse.ok) {
            const data = await signupResponse.json();
            setError(data?.error || 'Signup failed');
            setIsLoading(false);
            return;
        }

        const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (loginResponse.ok) {
            router.replace('/dashboard');
            router.refresh();
            return;
        }

        setError('Account created. Please login.');
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <CosmicBackground />

            <div className="w-full max-w-md relative z-10">
                <CosmicCard glow="cyan" title="NEW IDENTITY CREATION" className="shadow-2xl shadow-cyan-900/40">
                    <div className="flex flex-col items-center mb-8">
                        <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4 animate-bounce-slow">
                            <UserPlus size={32} className="text-cyan-400" />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-widest uppercase">
                            Join the Fleet
                        </h1>
                        <p className="text-xs text-slate-400 uppercase tracking-widest mt-2">
                            Begin your journey to mastery
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 block">
                                Designation (Name)
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all placeholder:text-slate-600 font-mono text-sm pl-10"
                                    placeholder="Commander Shepard"
                                    required
                                />
                                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 block">
                                Communication Link (Email)
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all placeholder:text-slate-600 font-mono text-sm pl-10"
                                    placeholder="user@cosmic.net"
                                    required
                                />
                                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 block">
                                Security Code
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all placeholder:text-slate-600 font-mono text-sm pl-10"
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
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] mt-4"
                        >
                            {isLoading ? 'Initializing...' : 'Initialize System Access'}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-white/5">
                        <p className="text-xs text-slate-500">
                            Already initialized?{' '}
                            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-bold uppercase tracking-wider transition-colors ml-1 hover:underline decoration-violet-500/50">
                                Access Portal
                            </Link>
                        </p>
                    </div>
                </CosmicCard>
            </div>
        </div>
    );
}
