import clientPromise from '@/lib/mongodb';
import type { Filter, ObjectId } from 'mongodb';

export type QuestionDoc = {
    _id?: ObjectId;
    subject: string;
    topic: string;
    difficulty: number; // 1-5
    text: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
};

const seedQuestions: QuestionDoc[] = [
    {
        subject: 'Computer Science',
        topic: 'Binary',
        difficulty: 2,
        text: 'What is the binary representation of decimal 13?',
        options: ['1101', '1011', '1110', '1001'],
        correctAnswer: '1101',
        explanation: '13 = 8 + 4 + 1, so binary is 1101.',
    },
    {
        subject: 'Computer Science',
        topic: 'Data Structures',
        difficulty: 2,
        text: 'Which data structure uses FIFO (First In First Out)?',
        options: ['Queue', 'Stack', 'Tree', 'Graph'],
        correctAnswer: 'Queue',
        explanation: 'Queues process items in the order they are added (FIFO).',
    },
    {
        subject: 'Computer Science',
        topic: 'Algorithms',
        difficulty: 3,
        text: 'Binary search works best on which type of data?',
        options: ['Unsorted array', 'Sorted array', 'Linked list', 'Heap'],
        correctAnswer: 'Sorted array',
        explanation: 'Binary search requires sorted data to eliminate half the search space each step.',
    },
    {
        subject: 'Mathematics',
        topic: 'Algebra',
        difficulty: 2,
        text: 'Solve for x: 2x + 5 = 17',
        options: ['4', '5', '6', '7'],
        correctAnswer: '6',
        explanation: '2x = 12 so x = 6.',
    },
    {
        subject: 'Mathematics',
        topic: 'Geometry',
        difficulty: 3,
        text: 'What is the sum of interior angles of a triangle?',
        options: ['90°', '180°', '270°', '360°'],
        correctAnswer: '180°',
        explanation: 'All triangles have interior angles summing to 180°.',
    },
    {
        subject: 'Physics',
        topic: 'Motion',
        difficulty: 3,
        text: 'Which formula represents Newton’s Second Law?',
        options: ['F = ma', 'E = mc^2', 'V = IR', 'p = mv^2'],
        correctAnswer: 'F = ma',
        explanation: 'Force equals mass times acceleration.',
    },
    {
        subject: 'Biology',
        topic: 'Cells',
        difficulty: 2,
        text: 'Which organelle is known as the powerhouse of the cell?',
        options: ['Nucleus', 'Mitochondrion', 'Ribosome', 'Golgi apparatus'],
        correctAnswer: 'Mitochondrion',
        explanation: 'Mitochondria produce ATP, the cell’s energy currency.',
    },
    {
        subject: 'History',
        topic: 'World History',
        difficulty: 2,
        text: 'Which event marked the start of World War II?',
        options: ['Pearl Harbor', 'Invasion of Poland', 'Treaty of Versailles', 'Battle of Britain'],
        correctAnswer: 'Invasion of Poland',
        explanation: 'Germany’s invasion of Poland in 1939 triggered WWII.',
    },
];

export async function ensureSeedQuestions() {
    const client = await clientPromise;
    const db = client.db();
    const count = await db.collection<QuestionDoc>('questions').estimatedDocumentCount();
    if (count === 0) {
        await db.collection<QuestionDoc>('questions').insertMany(seedQuestions);
    }
}

export function clampDifficulty(difficulty: number) {
    return Math.max(1, Math.min(5, Math.round(difficulty)));
}

export function getAdaptiveDifficulty(accuracy: number) {
    let base = 3;
    if (accuracy >= 0.85) base += 1;
    if (accuracy >= 0.95) base += 1;
    if (accuracy <= 0.55) base -= 1;
    if (accuracy <= 0.4) base -= 1;
    return clampDifficulty(base);
}

export async function fetchAdaptiveQuestions(params: {
    subject?: string;
    limit?: number;
    accuracy?: number;
    difficulty?: number;
}) {
    await ensureSeedQuestions();

    const client = await clientPromise;
    const db = client.db();

    const limit = Math.max(1, Math.min(20, params.limit ?? 5));
    const targetDifficulty = params.difficulty
        ? clampDifficulty(params.difficulty)
        : getAdaptiveDifficulty(params.accuracy ?? 0.65);

    const subject = params.subject;

    const baseMatch: Filter<QuestionDoc> = {
        difficulty: targetDifficulty,
    };
    if (subject) baseMatch.subject = subject;

    let results = await db.collection<QuestionDoc>('questions')
        .aggregate([
            { $match: baseMatch },
            { $sample: { size: limit } },
        ])
        .toArray();

    if (results.length < limit) {
        const fallbackMatch: Filter<QuestionDoc> = subject ? { subject } : {};
        results = await db.collection<QuestionDoc>('questions')
            .aggregate([
                { $match: fallbackMatch },
                { $sample: { size: limit } },
            ])
            .toArray();
    }

    return results;
}
