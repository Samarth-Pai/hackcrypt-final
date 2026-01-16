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
            title: 'Systems Pathfinder',
            location: 'Neo Bengaluru',
            bio: 'Exploring distributed systems, secure protocols, and game-based learning. Loves competitive quizzes and deep dives into algorithm design.',
            achievements: ['Sharpshooter', 'Persistent Learner'],
            badges: ['Quest Starter', 'Rising Star'],
            xp: 820,
            level: 3,
            completedLessons: 12,
            streak: { count: 4, lastActive: new Date() },
            winStreak: 2,
            totalQuestions: 48,
            totalCorrect: 36,
        },
        {
            name: 'Priya Sharma',
            email: 'priya@example.com',
            title: 'Bioinformatics Cadet',
            location: 'Mumbai Grid',
            bio: 'Merging biology and data science with a focus on pattern recognition. Enjoys flashcard marathons and collaborative learning sessions.',
            achievements: ['Master Explorer'],
            badges: ['Quest Apprentice'],
            xp: 1560,
            level: 4,
            completedLessons: 22,
            streak: { count: 7, lastActive: new Date() },
            winStreak: 4,
            totalQuestions: 72,
            totalCorrect: 58,
        },
        {
            name: 'Majin Buu',
            email: 'majinbuu@example.com',
            title: 'Chaos Catalyst',
            location: 'Candy Realm',
            bio: 'Playful but relentless learner who crushes streaks and collects trophies. Loves surprise duels and hyper-speed quizzes.',
            achievements: ['Sharpshooter', 'Persistent Learner', 'Master Explorer', 'Momentum Chain', 'Quiz Conqueror', 'Legendary Streak'],
            badges: ['Quest Starter', 'Quest Apprentice', 'Rising Star', 'Master Explorer'],
            xp: 2100,
            level: 5,
            completedLessons: 35,
            streak: { count: 12, lastActive: new Date() },
            winStreak: 6,
            totalQuestions: 120,
            totalCorrect: 96,
        },
    ];

    const users = userSeed.map((u) => ({
        name: u.name,
        email: u.email,
        title: u.title,
        location: u.location,
        bio: u.bio,
        password: hashedPassword,
        role: 'student',
        createdAt: new Date(),
        followers: [],
        following: [],
        gamification: {
            xp: u.xp,
            level: u.level,
            badges: u.badges,
            achievements: u.achievements,
            completedLessons: u.completedLessons,
            streak: u.streak,
            winStreak: u.winStreak,
        },
        performance: {
            totalQuestions: u.totalQuestions,
            totalCorrect: u.totalCorrect,
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
