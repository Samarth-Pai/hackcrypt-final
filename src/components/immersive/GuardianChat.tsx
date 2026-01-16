'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Send, X, User } from 'lucide-react';
import CosmicCard from '@/components/cosmic/CosmicCard';

interface Message {
    id: string;
    sender: 'guardian' | 'user';
    text: string;
}

interface GuardianChatProps {
    onClose: () => void;
}

const GUARDIAN_INITIAL_MESSAGE = "Greetings, seeker. I am the Guardian of the AI Stone. I can guide you through the intricacies of machine intelligence. Ask me about your recent quiz or any concept you find elusive.";

export default function GuardianChat({ onClose }: GuardianChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'guardian', text: GUARDIAN_INITIAL_MESSAGE }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputValue
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');

        // Mock Guardian Response
        setTimeout(() => {
            const responseMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'guardian',
                text: "I observe your query. Accessing vast neural archives... (This is a simplified simulation. The AI Core is currently offline for this sector.)"
            };
            setMessages(prev => [...prev, responseMsg]);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-2xl h-[600px] flex flex-col relative"
            >
                <CosmicCard glow="violet" className="flex-1 flex flex-col h-full !p-0 overflow-hidden shadow-2xl shadow-violet-900/20">

                    {/* Header */}
                    <div className="p-4 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-violet-500/20 border border-violet-500/30">
                                <Shield size={20} className="text-violet-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-100">
                                    Guardian Interface
                                </h3>
                                <p className="text-[10px] text-violet-400 font-mono animate-pulse">
                                    • ONLINE • LISTENING
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-gradient-to-b from-slate-950/30 to-slate-900/30">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-end gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                {/* Avatar */}
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center shrink-0 border
                                    ${msg.sender === 'guardian'
                                        ? 'bg-violet-950/50 border-violet-500/30 text-violet-400'
                                        : 'bg-slate-800 border-slate-700 text-slate-400'}
                                `}>
                                    {msg.sender === 'guardian' ? <Shield size={14} /> : <User size={14} />}
                                </div>

                                {/* Bubble */}
                                <div className={`
                                    max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed
                                    ${msg.sender === 'guardian'
                                        ? 'bg-violet-900/20 border border-violet-500/20 text-slate-200 rounded-bl-sm'
                                        : 'bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-br-sm'}
                                `}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/5 bg-slate-900/50">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about AI Stone after each quiz session..."
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-violet-500/50 transition-colors placeholder:text-slate-600"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className="absolute right-2 p-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </CosmicCard>
            </motion.div>
        </motion.div>
    );
}
