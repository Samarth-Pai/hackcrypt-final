
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

type TopPerformer = { name: string; score: number; progress: number };
type StrugglingTopic = { topic: string; studentCount: number; difficulty: 'High' | 'Medium' | 'Low' };

export function TopicInsights({ topPerformers, strugglingTopics }: { topPerformers: TopPerformer[]; strugglingTopics: StrugglingTopic[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Performers */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Trophy className="w-5 h-5 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Top Performers</h3>
                </div>

                <div className="space-y-4">
                    {topPerformers.map((student, index) => (
                        <motion.div
                            key={student.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 hover:border-lime-500/50 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm">
                                    {student.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="text-slate-200 font-medium">{student.name}</p>
                                    <p className="text-slate-500 text-xs">{student.progress}% Progress</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lime-400 font-bold">{student.score}%</p>
                                <div className="flex items-center gap-1 text-[10px] text-emerald-500">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>+2.4%</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Struggling Topics */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-rose-500/20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-rose-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Intervention Needed</h3>
                </div>

                <div className="space-y-4">
                    {strugglingTopics.map((topic, index) => (
                        <motion.div
                            key={topic.topic}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 hover:border-rose-500/50 transition-colors group"
                        >
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-slate-200 font-medium">{topic.topic}</p>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${topic.difficulty === 'High' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'
                                        }`}>
                                        {topic.difficulty} Difficulty
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-rose-500 rounded-full"
                                            style={{ width: `${(topic.studentCount / 45) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-slate-400 text-xs whitespace-nowrap">{topic.studentCount} students</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
