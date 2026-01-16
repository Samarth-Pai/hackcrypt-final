export type QuestProgress = {
    id: string;
    title: string;
    description: string;
    progress: number;
    target: number;
    rewardXp: number;
};

type UserSnapshot = {
    gamification?: {
        xp?: number;
        completedLessons?: number;
        streak?: { count?: number };
    };
    performance?: {
        totalQuestions?: number;
        totalCorrect?: number;
    };
};

const questDefinitions: Array<{
    id: string;
    title: string;
    description: string;
    target: number;
    rewardXp: number;
    getProgress: (user: UserSnapshot) => number;
}> = [
    {
        id: 'questions-10',
        title: 'Warm-Up Circuit',
        description: 'Answer 10 questions today.',
        target: 10,
        rewardXp: 40,
        getProgress: (user) => user.performance?.totalQuestions || 0,
    },
    {
        id: 'correct-8',
        title: 'Precision Protocol',
        description: 'Get 8 answers correct.',
        target: 8,
        rewardXp: 60,
        getProgress: (user) => user.performance?.totalCorrect || 0,
    },
    {
        id: 'streak-3',
        title: 'Momentum Chain',
        description: 'Maintain a 3-day streak.',
        target: 3,
        rewardXp: 80,
        getProgress: (user) => user.gamification?.streak?.count || 0,
    },
    {
        id: 'lessons-3',
        title: 'Quest Cadet',
        description: 'Complete 3 quizzes.',
        target: 3,
        rewardXp: 50,
        getProgress: (user) => user.gamification?.completedLessons || 0,
    },
    {
        id: 'xp-250',
        title: 'Energy Surge',
        description: 'Earn 250 XP total.',
        target: 250,
        rewardXp: 100,
        getProgress: (user) => user.gamification?.xp || 0,
    },
];

export function buildQuestProgress(user: UserSnapshot): QuestProgress[] {
    return questDefinitions.map((quest) => {
        const progress = Math.max(0, quest.getProgress(user));
        return {
            id: quest.id,
            title: quest.title,
            description: quest.description,
            progress,
            target: quest.target,
            rewardXp: quest.rewardXp,
        };
    });
}
