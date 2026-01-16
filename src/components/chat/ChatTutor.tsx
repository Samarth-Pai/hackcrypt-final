'use client';

import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

interface ChatTutorProps {
    context: string;
}

type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

export default function ChatTutor({ context }: ChatTutorProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'assistant',
            content: 'Ask me about any question or explanation from this quiz. I am here to help.',
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
        setMessages(nextMessages);
        setInput('');
        setLoading(true);

        const response = await fetch('/api/chat/tutor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ context, messages: nextMessages }),
        });

        if (response.ok) {
            const data = await response.json();
            setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || 'Let’s dig deeper!' }]);
        } else {
            setMessages((prev) => [...prev, { role: 'assistant', content: 'I had trouble answering that. Try again.' }]);
        }

        setLoading(false);
    };

    return (
        <div className="bg-[#5D4037]/40 p-6 rounded-xl border border-[#5D4037]">
            <div className="flex items-center gap-2 text-growth mb-4">
                <MessageCircle className="w-5 h-5" />
                <h3 className="font-bold">Discuss with AI Tutor</h3>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {messages.map((message, index) => (
                    <div
                        key={`${message.role}-${index}`}
                        className={`p-3 rounded-lg text-sm ${
                            message.role === 'assistant'
                                ? 'bg-earth/70 text-gray-200 border border-[#5D4037]'
                                : 'bg-forest/20 text-white border border-forest'
                        }`}
                    >
                        {message.content}
                    </div>
                ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
                <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask about a question, concept, or explanation"
                    className="flex-1 rounded-lg bg-earth border border-[#5D4037] px-3 py-2 text-sm text-white focus:outline-none focus:border-growth"
                />
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="px-3 py-2 bg-forest text-white rounded-lg hover:bg-[#1B5E20] disabled:opacity-60"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
