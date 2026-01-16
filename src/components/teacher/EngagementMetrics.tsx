
'use client';

import React from 'react';
import { engagementMetrics } from '@/lib/teacher-data';
import { Users, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function EngagementMetrics() {
    const stats = [
        { label: 'Active Students', value: engagementMetrics.activeStudents, total: engagementMetrics.totalStudents, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Avg Time Spent', value: engagementMetrics.avgTimeSpent, icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Completion Rate', value: `${engagementMetrics.completionRate}%`, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-colors"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <stat.icon size={80} />
                    </div>

                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                        <stat.icon size={24} />
                    </div>

                    <div className="relative z-10">
                        <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                        <div className="flex items-end gap-2 mt-1">
                            <h4 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h4>
                            {stat.total && <span className="text-slate-500 mb-1 text-sm">/ {stat.total}</span>}
                        </div>

                        {index === 0 && (
                            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                <TrendingUp size={14} />
                                <span>{engagementMetrics.engagementTrend}% from last week</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
