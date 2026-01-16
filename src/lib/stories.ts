export type StoryQuestion = {
    id: string;
    type: 'true_false' | 'mcq';
    prompt: string;
    options?: string[];
    correctAnswer: string;
};

export type StoryChoice = {
    label: string;
    nextId: string;
};

export type StoryCard = {
    id?: string;
    content: string;
    choices?: StoryChoice[];
};

export type Story = {
    id: string;
    title: string;
    topic: string;
    cards: Array<string | StoryCard>;
    questions: StoryQuestion[];
};

export type StoryGroup = {
    syllabusSlug: string;
    syllabusTitle: string;
    stories: Story[];
};
