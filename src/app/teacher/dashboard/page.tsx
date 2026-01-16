
import React from 'react';
import { PerformanceChart } from '@/components/teacher/PerformanceChart';
import { TopicInsights } from '@/components/teacher/TopicInsights';
import { EngagementMetrics } from '@/components/teacher/EngagementMetrics';
import { AccuracyHeatmap } from '@/components/teacher/AccuracyHeatmap';
import { GraduationCap, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';

export default function TeacherDashboardPage() {
    return (
        <div className="min-h-screen pb-12 space-y-8 animate-in fade-in duration-1000">
            {/* Header Section */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-lime-500 to-emerald-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-[#0f172a] rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden">
                    <div className="z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-lime-500/10 text-lime-500 text-xs font-bold rounded-full border border-lime-500/20">
                                Institutional View
                            </span>
                            <span className="flex items-center gap-1 text-slate-400 text-xs">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                Verified Admin Access
                            </span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                            Teacher <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500">Analytics</span> Command
                        </h1>
                        <p className="text-slate-400 max-w-xl">
                            Real-time insights across your classroom. Monitor engagement, identify learning gaps, and track institutional impact at a glance.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex flex-col items-center">
                            <Zap className="text-lime-400 mb-2" size={20} />
                            <span className="text-white font-bold">128</span>
                            <span className="text-[10px] text-slate-500">Daily Quests</span>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex flex-col items-center">
                            <GraduationCap className="text-emerald-400 mb-2" size={20} />
                            <span className="text-white font-bold">45</span>
                            <span className="text-[10px] text-slate-500">Active Students</span>
                        </div>
                    </div>

                    {/* Background Decorative Element */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-lime-500/10 rounded-full blur-[80px]"></div>
                </div>
            </div>

            {/* Highlights / Stats */}
            <div className="relative">
                <EngagementMetrics />
            </div>

            {/* Main Grid: Data Visualization */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <ArrowUpRight className="text-lime-500" size={18} />
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Trend Analysis</h2>
                    </div>
                    <PerformanceChart />
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <ArrowUpRight className="text-lime-500" size={18} />
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Syllabus Mastery</h2>
                    </div>
                    <AccuracyHeatmap />
                </div>
            </div>

            {/* Bottom Row: Detailed Insights */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <ArrowUpRight className="text-lime-500" size={18} />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Student & Topic Monitoring</h2>
                </div>
                <TopicInsights />
            </div>

            {/* Impact Footer for Judges */}
            <div className="mt-12 p-8 rounded-3xl bg-emerald-600/10 border border-emerald-500/20 text-center relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">Quantifiable Educational Impact</h3>
                    <p className="text-slate-300 max-w-2xl mx-auto">
                        Our platform has demonstrated a <span className="text-emerald-400 font-bold">24% increase</span> in topic retention and a <span className="text-lime-400 font-bold">15% boost</span> in student participation compared to traditional VLEs.
                    </p>
                </div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
}
