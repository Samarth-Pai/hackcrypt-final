import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing name, email, or password' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        // Check if user already exists
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            name,
            email,
            password: hashedPassword,
            role: 'student', // Default role
            createdAt: new Date(),
            gamification: {
                xp: 0,
                level: 1,
                badges: [],
                achievements: [],
                completedLessons: 0,
                streak: {
                    count: 0,
                    lastActive: null,
                },
            },
            performance: {
                totalQuestions: 0,
                totalCorrect: 0,
                bySubject: {},
                byDifficulty: {},
                hiddenDifficultyRank: 3,
            },
        };

        await db.collection('users').insertOne(newUser);

        return NextResponse.json({ success: true, message: 'User created successfully' }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
