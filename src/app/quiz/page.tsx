import QuizInterface from '@/components/quiz/QuizInterface';

// Mock Questions (Ideally fetched from DB based on ID)
const sampleQuestions = [
    {
        id: '1',
        text: 'What is the binary representation of the decimal number 5?',
        options: ['101', '110', '011', '100'],
        correctAnswer: '101',
    },
    {
        id: '2',
        text: 'Which data structure follows the LIFO (Last In First Out) principle?',
        options: ['Queue', 'Stack', 'Linked List', 'Tree'],
        correctAnswer: 'Stack',
    },
    {
        id: '3',
        text: 'What is the time complexity of a binary search?',
        options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'],
        correctAnswer: 'O(log n)',
    },
    {
        id: '4',
        text: 'Which command is used to stage files in Git?',
        options: ['git commit', 'git add', 'git push', 'git checkout'],
        correctAnswer: 'git add',
    },
    {
        id: '5',
        text: 'What does CSS stand for?',
        options: ['Creative Style Sheets', 'Computer Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 'Cascading Style Sheets',
    },
];

export default function QuizPage() {
    return (
        <div className="min-h-screen bg-[#3E2723] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4E342E] via-[#3E2723] to-[#2E1E1A] p-4 flex flex-col items-center">
            <div className="w-full max-w-3xl mb-8 flex justify-between items-center text-[#ededed] mt-8">
                <h1 className="text-2xl font-bold text-[#C6FF00]">Quest: CS Fundamentals</h1>
                <span className="bg-[#2E7D32] px-3 py-1 rounded-full text-xs font-bold">Reward: 15-50 XP</span>
            </div>

            <div className="w-full">
                <QuizInterface questions={sampleQuestions} />
            </div>
        </div>
    );
}
