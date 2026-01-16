'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf } from 'lucide-react';

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
            router.push('/dashboard');
            return;
        }

        setError('Account created. Please login.');
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-earth text-[#ededed] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-[#5D4037]/40 border border-forest rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-2 mb-6">
                    <Leaf className="w-6 h-6 text-forest" />
                    <h1 className="text-2xl font-bold text-growth">Join EduQuest</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-300">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-2 w-full rounded-lg bg-earth border border-[#5D4037] px-4 py-2 text-white focus:outline-none focus:border-growth"
                            required
                        />
                    </div>
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
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="mt-6 text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-sun hover:text-[#FFAB00] font-semibold">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
