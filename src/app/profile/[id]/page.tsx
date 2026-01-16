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

    return (
        <div className="min-h-screen bg-earth text-[#ededed] p-6">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-[#5D4037]/40 p-6 rounded-xl border border-[#5D4037]">
                    <h1 className="text-2xl font-bold text-growth">{user.name}</h1>
                    <p className="text-sm text-gray-400">Level {user.gamification?.level || 1}</p>
                    <div className="mt-4 flex gap-6 text-sm text-gray-300">
                        <span>{followers.length} Followers</span>
                        <span>{following.length} Following</span>
                    </div>
                    {!isSelf && session && (
                        <div className="mt-4">
                            <FollowButton userId={id} isFollowing={isFollowing} />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#5D4037]/30 p-5 rounded-xl border border-[#5D4037]">
                        <h3 className="text-sm text-gray-400">XP</h3>
                        <p className="text-xl font-bold text-sun">{user.gamification?.xp || 0}</p>
                    </div>
                    <div className="bg-[#5D4037]/30 p-5 rounded-xl border border-[#5D4037]">
                        <h3 className="text-sm text-gray-400">Win Streak</h3>
                        <p className="text-xl font-bold text-growth">{user.gamification?.winStreak || 0}</p>
                    </div>
                </div>

                <div className="bg-[#3E2723]/70 p-6 rounded-xl border border-[#5D4037]">
                    <h3 className="text-lg font-bold text-growth mb-3">Achievements</h3>
                    <div className="flex flex-wrap gap-2">
                        {(user.gamification?.achievements || []).concat(user.gamification?.badges || []).map((badge: string) => (
                            <span key={badge} className="px-3 py-1 bg-forest/20 text-sun rounded-full text-xs border border-forest">
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
