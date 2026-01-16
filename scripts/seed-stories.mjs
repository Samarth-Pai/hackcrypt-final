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

const storiesPath = path.join(root, 'data', 'stories.json');
const storiesContent = fs.readFileSync(storiesPath, 'utf8');
const stories = JSON.parse(storiesContent);

const client = new MongoClient(uri, {});

try {
    await client.connect();
    const db = client.db();
    const storiesCollection = db.collection('stories');

    await storiesCollection.deleteMany({});

    const result = await storiesCollection.insertMany(
        stories.map((group) => ({
            ...group,
            createdAt: new Date(),
        }))
    );

    console.log(`Inserted ${result.insertedCount} story groups.`);
} finally {
    await client.close();
}
