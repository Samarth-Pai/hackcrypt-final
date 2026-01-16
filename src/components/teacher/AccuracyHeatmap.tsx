
'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type TopicAccuracy = { topic: string; accuracy: number; students: number };

export function AccuracyHeatmap({ data }: { data: TopicAccuracy[] }) {
    const getBarColor = (accuracy: number) => {
        if (accuracy >= 80) return '#a3e635'; // Lime-400
        if (accuracy >= 60) return '#fbbf24'; // Amber-400
        return '#f43f5e'; // Rose-500
    };

    return (
        <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl h-[400px]">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white tracking-tight">Topic Accuracy</h3>
                <p className="text-slate-400 text-sm">Class-wide mastery by subject area</p>
            </div>

            <ResponsiveContainer width="100%" height="80%">
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ left: 40, right: 40 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="topic"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 13 }}
                        width={100}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{
                            backgroundColor: '#0f172a',
                            border: '1px solid #1e293b',
                            borderRadius: '12px',
                            color: '#fff'
                        }}
                    />
                    <Bar dataKey="accuracy" radius={[0, 10, 10, 0]} barSize={20}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.accuracy)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
