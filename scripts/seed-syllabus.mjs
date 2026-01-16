import fs from 'node:fs';
import path from 'node:path';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const root = process.cwd();
const envPath = path.join(root, '.env');

const loadEnv = () => {
    if (!fs.existsSync(envPath)) return;
    const raw = fs.readFileSync(envPath, 'utf8');
    raw.split(/\r?\n/).forEach((line) => {
        if (!line || line.startsWith('#')) return;
        const index = line.indexOf('=');
        if (index === -1) return;
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim();
        if (!process.env[key]) {
            process.env[key] = value;
        }
    });
};

loadEnv();

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('MONGODB_URI is not set');
}

const syllabusPath = path.join(root, 'data', 'syllabus-questions.json');
const content = fs.readFileSync(syllabusPath, 'utf8');
const questions = JSON.parse(content);

const syllabiPath = path.join(root, 'data', 'syllabi.json');
const syllabiContent = fs.readFileSync(syllabiPath, 'utf8');
const syllabi = JSON.parse(syllabiContent);

const client = new MongoClient(uri, {});

try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('questions');
    const syllabiCollection = db.collection('syllabi');
    const usersCollection = db.collection('users');
    const historyCollection = db.collection('history');
    const quizzesCollection = db.collection('quizzes');

    await Promise.all([
        collection.deleteMany({}),
        syllabiCollection.deleteMany({}),
        usersCollection.deleteMany({}),
        historyCollection.deleteMany({}),
        quizzesCollection.deleteMany({}),
    ]);

    const subjectToSlug = new Map(syllabi.map((s) => [s.subject, s.slug]));

    const syllabiToInsert = syllabi.map((s) => ({
        ...s,
        createdAt: new Date(),
    }));
    const resultSyllabi = await syllabiCollection.insertMany(syllabiToInsert);
    console.log(`Inserted ${resultSyllabi.insertedCount} syllabi.`);

    const toInsert = questions.map((q) => ({
        ...q,
        syllabusSlug: subjectToSlug.get(q.subject) || 'general',
        createdAt: new Date(),
    }));
    const resultQuestions = await collection.insertMany(toInsert);
    console.log(`Inserted ${resultQuestions.insertedCount} syllabus questions.`);

    const hashedPassword = await bcrypt.hash('password123', 10);
    const userSeed = [
        {
            name: 'Alex Rivera',
            email: 'alex@example.com',
        },
        {
            name: 'Priya Sharma',
            email: 'priya@example.com',
        },
        {
            name: 'Jordan Lee',
            email: 'jordan@example.com',
        },
    ];

    const users = userSeed.map((u) => ({
        ...u,
        password: hashedPassword,
        role: 'student',
        createdAt: new Date(),
        followers: [],
        following: [],
        gamification: {
            xp: 0,
            level: 1,
            badges: [],
            achievements: [],
            completedLessons: 0,
            streak: { count: 0, lastActive: null },
            winStreak: 0,
        },
        performance: {
            totalQuestions: 0,
            totalCorrect: 0,
            bySubject: {},
            byDifficulty: {},
            hiddenDifficultyRank: 3,
        },
    }));

    const resultUsers = await usersCollection.insertMany(users);
    console.log(`Inserted ${resultUsers.insertedCount} users.`);
} finally {
    await client.close();
}
