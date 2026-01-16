
import React from 'react';
import { PerformanceChart } from '@/components/teacher/PerformanceChart';
import { TopicInsights } from '@/components/teacher/TopicInsights';
import { EngagementMetrics } from '@/components/teacher/EngagementMetrics';
import { AccuracyHeatmap } from '@/components/teacher/AccuracyHeatmap';
import { GraduationCap, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import clientPromise from '@/lib/mongodb';
import { getSessionUserDoc } from '@/lib/session';
import { ObjectId } from 'mongodb';

type HistoryDoc = {
    userId: ObjectId;
    score: number;
    totalQuestions: number;
    accuracy: number;
    subjects: string[];
    topics: string[];
    createdAt: Date;
};

type UserSummary = {
    _id: ObjectId;
    name?: string;
    performance?: {
        totalQuestions?: number;
        totalCorrect?: number;
    };
import { notFound } from 'next/navigation';

export default function TeacherDashboardPage() {
    return notFound();
}
    const hours = Math.floor(minutes / 60);
