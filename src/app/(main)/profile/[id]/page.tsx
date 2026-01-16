import React from 'react';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import FollowButton from '@/components/social/FollowButton';
import { getSessionUser } from '@/lib/session';
import ProfileHeader from '@/components/profile/ProfileHeader';
import SkillRadarGraph from '@/components/profile/SkillRadarGraph';
import { Shield, Trophy, Zap, Brain, Hexagon, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();
    let userId: ObjectId | null = null;
    try {
        userId = new ObjectId(id);
    } catch {
        return <div className="text-white p-8">Profile not found.</div>;
    }

    const user = await db.collection('users').findOne({ _id: userId });
    if (!user) {
        return <div className="text-white p-8">Profile not found.</div>;
    }

    const session = await getSessionUser();
    const isSelf = session?.userId.toString() === id;
    const followers = user.followers || [];
    const following = user.following || [];
    const isFollowing = session ? followers.some((id: ObjectId) => id.toString() === session.userId.toString()) : false;
    const accuracy = user.performance?.totalQuestions > 0
        ? Math.round((user.performance.totalCorrect / user.performance.totalQuestions) * 100)
        : 0;
    const streak = user.gamification?.streak?.count || 0;

    // Serialize user for Client Component
    const serializedUser = JSON.parse(JSON.stringify(user));

    // Marvel Badge System Mapping
    const MARVEL_BADGES: Record<string, { icon: React.ReactElement, label: string, color: string, glow: string }> = {
        'Onboarding Complete': { icon: <Shield size={14} />, label: 'Avenger Initiate', color: 'text-blue-400', glow: 'shadow-blue-500/50' },
        'First Win': { icon: <Trophy size={14} />, label: 'First Victory', color: 'text-yellow-400', glow: 'shadow-yellow-500/50' },
        '7 Day Streak': { icon: <Zap size={14} />, label: 'Powered Up', color: 'text-purple-400', glow: 'shadow-purple-500/50' },
        'Quiz Master': { icon: <Brain size={14} />, label: 'Cerebro Connected', color: 'text-pink-400', glow: 'shadow-pink-500/50' },
        'Level 10': { icon: <Hexagon size={14} />, label: 'Vibranium Tier', color: 'text-cyan-400', glow: 'shadow-cyan-500/50' },
    };

    // Calculate Marvel Stats
    // Normalize values to 0-100 scale for the graph
    const combatStats = {
        intel: Math.min(100, (user.performance?.totalQuestions || 0) * 2), // Knowledge based on questions
        tech: Math.min(100, (user.gamification?.xp || 0) / 100), // XP based
        combat: Math.min(100, (user.gamification?.winStreak || 0) * 10), // Streak based
        speed: 75, // Placeholder/Mock for now (React Time?)
        defense: accuracy, // Accuracy as Defense
    };

    return (
        <div className="min-h-screen bg-[url('/assets/cosmic/bg-stars.png')] bg-cover bg-fixed text-slate-200 p-6 relative">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />

            <div className="max-w-5xl mx-auto space-y-8 relative z-10">
                <ProfileHeader user={serializedUser} isSelf={isSelf} isFollowing={isFollowing} />



                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Cosmic Stats Grid */}
                    <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-start">
                        <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                            <h3 className="text-[10px] text-cyan-400/70 font-mono uppercase tracking-[0.2em] mb-2">Experience</h3>
                            <p className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors shadow-cyan-500/50">{user.gamification?.xp || 0}<span className="text-sm font-normal text-gray-500 ml-1">XP</span></p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                            <h3 className="text-[10px] text-purple-400/70 font-mono uppercase tracking-[0.2em] mb-2">Win Streak</h3>
                            <p className="text-3xl font-black text-white group-hover:text-purple-400 transition-colors">{user.gamification?.winStreak || 0}</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                            <h3 className="text-[10px] text-green-400/70 font-mono uppercase tracking-[0.2em] mb-2">Accuracy</h3>
                            <p className="text-3xl font-black text-white group-hover:text-green-400 transition-colors">{accuracy}%</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                            <h3 className="text-[10px] text-yellow-400/70 font-mono uppercase tracking-[0.2em] mb-2">Missions</h3>
                            <p className="text-3xl font-black text-white group-hover:text-yellow-400 transition-colors">{user.gamification?.completedLessons || 0}</p>
                        </div>
                    </div>

                    {/* Right: Skill Radar Graph */}
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                        <h3 className="text-xs font-black text-cyan-400 tracking-[0.3em] uppercase mb-4 z-10">Power Grid</h3>

                        <SkillRadarGraph stats={combatStats} />

                        <div className="mt-4 flex gap-4 text-[10px] text-gray-500 font-mono">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-400" /> ACTIVE</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-white/20" /> POTENTIAL</span>
                        </div>
                    </div>
                </div>

                {/* Achievements Section */}
                <div className="bg-gradient-to-br from-white/5 to-transparent p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <Trophy className="text-yellow-500" size={20} />
                        <span className="tracking-tight">HALL OF LEGENDS</span>
                    </h3>

                    <div className="flex flex-wrap gap-4 pt-4">
                        {(user.gamification?.achievements || []).concat(user.gamification?.badges || []).map((badge: string, i: number) => {
                            const marvelBadge = MARVEL_BADGES[badge] || {
                                icon: <Hexagon size={14} /> as React.ReactElement,
                                label: badge,
                                color: 'text-slate-400',
                                glow: 'shadow-white/10'
                            };

                            return (
                                <div key={i} className="group relative">
                                    {/* Holographic Projection (Hover) */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-24 h-24 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-8 group-hover:translate-y-0 pointer-events-none z-30 perspective-500">
                                        {/* Spinning Reactor Ring */}
                                        <div className={`absolute inset-0 rounded-full border-2 border-dashed border-opacity-40 animate-[spin_4s_linear_infinite] ${marvelBadge.color.replace('text-', 'border-')}`} />
                                        <div className={`absolute inset-2 rounded-full border border-dotted border-opacity-30 animate-[spin_6s_linear_infinite_reverse] ${marvelBadge.color.replace('text-', 'border-')}`} />

                                        {/* Core Icon */}
                                        <div className={`relative z-10 p-4 rounded-full bg-black/90 border border-white/20 backdrop-blur-xl ${marvelBadge.color} shadow-[0_0_50px_currentColor] group-hover:scale-110 transition-transform duration-300`}>
                                            {React.cloneElement(marvelBadge.icon, { size: 32, strokeWidth: 1.5 } as any)}
                                        </div>

                                        {/* Projection Beam */}
                                        <div className={`absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-12 h-24 bg-gradient-to-t from-${marvelBadge.color.split('-')[1]}-500/20 to-transparent blur-md`} style={{ clipPath: 'polygon(30% 100%, 70% 100%, 100% 0, 0 0)' }} />
                                    </div>

                                    <div className="flex items-center gap-3 px-4 py-3 bg-black/40 border border-white/10 rounded-xl hover:border-white/30 hover:bg-white/5 transition-all cursor-default relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                                        <div className={`p-2 rounded-lg bg-white/5 ${marvelBadge.color} group-hover:scale-110 transition-transform relative z-10`}>
                                            {marvelBadge.icon}
                                        </div>
                                        <div className="relative z-10">
                                            <p className={`text-xs font-bold uppercase tracking-wider ${marvelBadge.color} group-hover:shadow-[0_0_20px_currentColor] transition-all`}>{marvelBadge.label}</p>
                                            <p className="text-[10px] text-gray-500 font-medium">Unlocked</p>
                                        </div>

                                        {/* Hover Glow */}
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-${marvelBadge.color.split('-')[1]}-500 blur-xl transition-opacity duration-500`} />
                                    </div>
                                </div>
                            );
                        })}

                        {(user.gamification?.achievements || []).length === 0 && (user.gamification?.badges || []).length === 0 && (
                            <div className="w-full text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
                                <Shield className="mx-auto text-gray-600 mb-3 opacity-50" size={32} />
                                <p className="text-gray-500 font-medium">No honors awarded yet.</p>
                                <p className="text-xs text-gray-600 mt-1">Complete generic missions to earn your place.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </div >
    );
}
