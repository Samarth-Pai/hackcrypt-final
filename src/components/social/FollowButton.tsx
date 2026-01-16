'use client';

import { useState } from 'react';

export default function FollowButton({ userId, isFollowing }: { userId: string; isFollowing: boolean }) {
    const [following, setFollowing] = useState(isFollowing);
    const [loading, setLoading] = useState(false);

    const toggleFollow = async () => {
        setLoading(true);
        const route = following ? '/api/social/unfollow' : '/api/social/follow';
        const response = await fetch(route, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });

        if (response.ok) {
            setFollowing(!following);
        }

        setLoading(false);
    };

    return (
        <button
            onClick={toggleFollow}
            disabled={loading}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
                following ? 'bg-[#5D4037] text-gray-200' : 'bg-forest text-white'
            }`}
        >
            {following ? 'Following' : 'Follow'}
        </button>
    );
}
