import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import FollowButton from '@/components/social/FollowButton';
import { getSessionUser } from '@/lib/session';

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

    return (
        <div className="min-h-screen bg-earth text-[#ededed] p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="relative overflow-hidden rounded-3xl border border-[#5D4037] bg-linear-to-br from-[#4E342E] via-[#2E1E1A] to-[#1B1B1B] p-8">
                    <div className="absolute -top-16 -right-16 w-64 h-64 bg-sun/10 rounded-full blur-3xl" />
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-sun/20 border border-sun/40 flex items-center justify-center text-3xl font-black text-sun">
                                {(user.name || 'U').slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-growth">{user.name}</h1>
                                <p className="text-sm text-gray-300">{user.title || 'Explorer'} • Level {user.gamification?.level || 1}</p>
                                <p className="text-xs text-gray-400 mt-1">{user.location || 'Unknown Sector'}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="px-4 py-2 rounded-full bg-forest/20 border border-forest text-xs text-sun">{followers.length} Followers</div>
                            <div className="px-4 py-2 rounded-full bg-forest/20 border border-forest text-xs text-sun">{following.length} Following</div>
                            <div className="px-4 py-2 rounded-full bg-sun/20 border border-sun text-xs text-sun">Streak {streak} days</div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-300 mt-6 max-w-2xl">{user.bio || 'This explorer is charting new learning worlds. Bio sync pending.'}</p>
                    {!isSelf && session && (
                        <div className="mt-6">
                            <FollowButton userId={id} isFollowing={isFollowing} />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#5D4037]/30 p-5 rounded-xl border border-[#5D4037]">
                        <h3 className="text-xs text-gray-400 uppercase tracking-widest">XP</h3>
                        <p className="text-2xl font-bold text-sun">{user.gamification?.xp || 0}</p>
                    </div>
                    <div className="bg-[#5D4037]/30 p-5 rounded-xl border border-[#5D4037]">
                        <h3 className="text-xs text-gray-400 uppercase tracking-widest">Win Streak</h3>
                        <p className="text-2xl font-bold text-growth">{user.gamification?.winStreak || 0}</p>
                    </div>
                    <div className="bg-[#5D4037]/30 p-5 rounded-xl border border-[#5D4037]">
                        <h3 className="text-xs text-gray-400 uppercase tracking-widest">Accuracy</h3>
                        <p className="text-2xl font-bold text-sun">{accuracy}%</p>
                    </div>
                    <div className="bg-[#5D4037]/30 p-5 rounded-xl border border-[#5D4037]">
                        <h3 className="text-xs text-gray-400 uppercase tracking-widest">Quizzes Completed</h3>
                        <p className="text-2xl font-bold text-growth">{user.gamification?.completedLessons || 0}</p>
                    </div>
                </div>

                <div className="bg-[#3E2723]/70 p-6 rounded-2xl border border-[#5D4037]">
                    <h3 className="text-lg font-bold text-growth mb-3">Achievements & Badges</h3>
                    <div className="flex flex-wrap gap-2">
                        {(user.gamification?.achievements || []).concat(user.gamification?.badges || []).map((badge: string) => (
                            <span key={badge} className="px-3 py-1 bg-sun/10 text-sun rounded-full text-xs border border-sun/40">
                                {badge}
                            </span>
                        ))}
                        {(user.gamification?.achievements || []).length === 0 && (user.gamification?.badges || []).length === 0 && (
                            <p className="text-sm text-gray-400">No achievements yet. Complete quests to unlock.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
