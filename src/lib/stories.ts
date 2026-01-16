export type StoryQuestion = {
    id: string;
    type: 'true_false' | 'mcq';
    prompt: string;
    options?: string[];
    correctAnswer: string;
};

export type Story = {
    id: string;
    title: string;
    topic: string;
    cards: string[];
    questions: StoryQuestion[];
};

export type StoryGroup = {
    syllabusSlug: string;
    syllabusTitle: string;
    stories: Story[];
};
