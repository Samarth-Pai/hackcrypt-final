'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Share2, MapPin } from 'lucide-react';
import FollowButton from '@/components/social/FollowButton';
import MarvelAvatar, { HeroType, AvatarColors, DEFAULT_AVATAR_COLORS } from './MarvelAvatar';
import AvatarEditor from './AvatarEditor';
import { updateUserAvatar, getUsersDetails } from '@/app/actions/user';

import Link from 'next/link';

interface ProfileHeaderProps {
    user: any;
    isSelf: boolean;
    isFollowing: boolean;
}

export default function ProfileHeader({ user, isSelf, isFollowing }: ProfileHeaderProps) {
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [networkModal, setNetworkModal] = useState<{ type: 'followers' | 'following', users: any[] } | null>(null);
    const [isLoadingNetwork, setIsLoadingNetwork] = useState(false);

    // Initialize state with support for potential existing image config or default to tech
    const [avatarConfig, setAvatarConfig] = useState<{
        type?: 'custom' | 'classic',
        hero: HeroType,
        colors: AvatarColors,
        imageUrl?: string
    }>(
        user.avatarConfig || { type: 'custom', hero: 'tech', colors: DEFAULT_AVATAR_COLORS.tech }
    );

    const handleSaveAvatar = async (config: { type: 'custom' | 'classic', hero?: HeroType, colors?: AvatarColors, imageUrl?: string }) => {
        // Prepare the new config object, preserving defaults if switching types
        const newConfig = {
            type: config.type,
            hero: config.hero || avatarConfig.hero || 'tech',
            colors: config.colors || avatarConfig.colors || DEFAULT_AVATAR_COLORS.tech,
            imageUrl: config.imageUrl
        };

        setAvatarConfig(newConfig);
        setIsEditingAvatar(false);

        // Persist to server
        if (isSelf) {
            await updateUserAvatar(newConfig);
        }
    };

    const handleShowNetwork = async (type: 'followers' | 'following') => {
        const rawIds = type === 'followers' ? user.followers : user.following;
        console.log(`[ProfileHeader] Clicked ${type}, IDs:`, rawIds);

        if (!rawIds || rawIds.length === 0) {
            // Open modal immediately with empty list
            setNetworkModal({ type, users: [] });
            return;
        }

        const targetIds = rawIds.map((id: any) => String(id));
        setIsLoadingNetwork(true);

        try {
            const users = await getUsersDetails(targetIds);
            console.log('[ProfileHeader] Fetched Users:', users);
            setNetworkModal({ type, users });
        } catch (error) {
            console.error('Failed to load network:', error);
            alert('Failed to load connection data. Check console.');
        } finally {
            setIsLoadingNetwork(false);
        }
    };

    const followers = user.followers || [];
    const following = user.following || [];
    const streak = user.gamification?.streak?.count || 0;

    return (
        <div className="relative overflow-hidden rounded-3xl border border-[#5D4037] bg-linear-to-br from-[#4E342E] via-[#2E1E1A] to-[#1B1B1B] p-8">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-sun/10 rounded-full blur-3xl" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
                <div className="flex items-center gap-6">
                    {/* Avatar Section */}
                    <div className="relative group">
                        <div className="relative z-10">
                            {avatarConfig.type === 'classic' && avatarConfig.imageUrl ? (
                                <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                                    <img
                                        src={avatarConfig.imageUrl}
                                        alt="Profile Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <MarvelAvatar
                                    hero={avatarConfig.hero}
                                    colors={avatarConfig.colors}
                                    size={100}
                                    className="shadow-2xl"
                                />
                            )}
                        </div>

                        {/* Edit Button (Only for self) */}
                        {isSelf && (
                            <button
                                onClick={() => setIsEditingAvatar(true)}
                                className="absolute -bottom-2 -right-2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                                title="Customize Avatar"
                            >
                                <Settings size={14} />
                            </button>
                        )}
                    </div>

                    {/* User Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-black text-growth tracking-tight">{user.name}</h1>
                            {user.gamification?.level && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sun/20 text-sun border border-sun/40">
                                    LVL {user.gamification.level}
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-gray-300 font-medium flex items-center gap-2">
                            {user.title || 'Explorer'}
                            {user.location && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-gray-500" />
                                    <span className="flex items-center gap-1 text-gray-400">
                                        <MapPin size={10} /> {user.location}
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex flex-col items-end gap-4">
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => handleShowNetwork('followers')}
                            className="px-4 py-2 rounded-full bg-forest/20 border border-forest text-xs text-sun font-bold transition-all hover:bg-forest/30 cursor-pointer active:scale-95"
                        >
                            {followers.length} <span className="font-normal opacity-70">Followers</span>
                        </button>
                        <button
                            onClick={() => handleShowNetwork('following')}
                            className="px-4 py-2 rounded-full bg-forest/20 border border-forest text-xs text-sun font-bold transition-all hover:bg-forest/30 cursor-pointer active:scale-95"
                        >
                            {following.length} <span className="font-normal opacity-70">Following</span>
                        </button>
                        <div className="px-4 py-2 rounded-full bg-sun/20 border border-sun text-xs text-sun font-bold flex items-center gap-1">
                            🔥 {streak} <span className="font-normal opacity-70">Day Streak</span>
                        </div>
                    </div>

                    {!isSelf && (
                        <div className="flex gap-2">
                            <FollowButton userId={user._id} isFollowing={isFollowing} />
                            <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold flex items-center gap-2 transition-colors">
                                <Share2 size={14} /> Share
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <p className="text-sm text-gray-300 mt-6 max-w-2xl leading-relaxed">
                {user.bio || 'This explorer is charting new learning worlds. Bio sync pending.'}
            </p>

            {/* Avatar Editor Modal */}
            {isEditingAvatar && (
                <AvatarEditor
                    initialHero={avatarConfig.hero}
                    initialColors={avatarConfig.colors}
                    initialImage={avatarConfig.imageUrl}
                    onSave={handleSaveAvatar}
                    onClose={() => setIsEditingAvatar(false)}
                />
            )}

            {/* Network Users Modal */}
            <AnimatePresence>
                {networkModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setNetworkModal(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-2xl relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

                            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-white capitalize flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                    {networkModal.type}
                                </h3>
                                <button onClick={() => setNetworkModal(null)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white">
                                    <Settings size={16} className="rotate-45" />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-2">
                                {networkModal.users.map((netUser) => (
                                    <Link key={netUser._id} href={`/profile/${netUser._id}`} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors group">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-cyan-400/50 transition-colors">
                                            {netUser.avatarConfig?.imageUrl ? (
                                                <img src={netUser.avatarConfig.imageUrl} alt={netUser.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-xs font-bold text-white">
                                                    {netUser.name.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{netUser.name}</p>
                                            <p className="text-xs text-gray-500">{netUser.title || 'Explorer'}</p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Share2 size={12} className="text-cyan-400" />
                                        </div>
                                    </Link>
                                ))}
                                {networkModal.users.length === 0 && (
                                    <div className="p-8 text-center text-gray-500 text-sm">
                                        No connections found in this sector.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
