'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf } from 'lucide-react';

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
        <div className="min-h-screen bg-earth text-[#ededed] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-[#5D4037]/40 border border-forest rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-2 mb-6">
                    <Leaf className="w-6 h-6 text-forest" />
                    <h1 className="text-2xl font-bold text-growth">Welcome back</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 w-full rounded-lg bg-earth border border-[#5D4037] px-4 py-2 text-white focus:outline-none focus:border-growth"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 w-full rounded-lg bg-earth border border-[#5D4037] px-4 py-2 text-white focus:outline-none focus:border-growth"
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-300">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-full bg-forest hover:bg-[#1B5E20] text-white font-bold transition-colors"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="mt-6 text-sm text-gray-400">
                    New explorer?{' '}
                    <Link href="/signup" className="text-sun hover:text-[#FFAB00] font-semibold">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}
