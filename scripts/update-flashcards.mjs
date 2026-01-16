import fs from 'node:fs';
import path from 'node:path';
import { MongoClient } from 'mongodb';

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

const syllabiPath = path.join(root, 'data', 'syllabi.json');
const syllabiContent = fs.readFileSync(syllabiPath, 'utf8');
const syllabi = JSON.parse(syllabiContent);

const client = new MongoClient(uri, {});

try {
    await client.connect();
    const db = client.db();
    const syllabiCollection = db.collection('syllabi');

    for (const syllabus of syllabi) {
        await syllabiCollection.updateOne(
            { slug: syllabus.slug },
            {
                $set: {
                    title: syllabus.title,
                    subject: syllabus.subject,
                    description: syllabus.description,
                    flashcards: syllabus.flashcards,
                    matchPairs: syllabus.matchPairs || [],
                    updatedAt: new Date(),
                },
            },
            { upsert: true }
        );
    }

    console.log(`Updated ${syllabi.length} syllabus records.`);
} finally {
    await client.close();
}
