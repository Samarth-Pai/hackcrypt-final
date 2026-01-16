'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type HeroType = 'tech' | 'soldier' | 'web' | 'thunder';

export interface AvatarColors {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
}

export interface MarvelAvatarProps {
    hero: HeroType;
    colors: AvatarColors;
    size?: number;
    className?: string;
}

export const DEFAULT_AVATAR_COLORS: Record<HeroType, AvatarColors> = {
    tech: {
        primary: '#FFD700', // Gold
        secondary: '#BF0A30', // Red
        accent: '#00FFFF', // Arc Reactor Blue
        bg: '#250202', // Dark Red Bg
    },
    soldier: {
        primary: '#0033A0', // Blue
        secondary: '#FFFFFF', // White
        accent: '#BF0A30', // Red
        bg: '#000E26', // Dark Blue Bg
    },
    web: {
        primary: '#E23636', // Spider Red
        secondary: '#000000', // Web Black
        accent: '#FFFFFF', // Eyes
        bg: '#1A0505', // Dark Red Bg
    },
    thunder: {
        primary: '#C0C0C0', // Silver
        secondary: '#FFD700', // Gold
        accent: '#00BFFF', // Lightning Blue
        bg: '#1A1A1A', // Dark Grey Bg
    }
};

export default function MarvelAvatar({ hero, colors, size = 120, className = '' }: MarvelAvatarProps) {
    // Shared container styles
    const containerStyle = {
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${colors.bg}, #000)`,
        borderRadius: '20%',
        boxShadow: `0 0 20px ${colors.primary}40, inset 0 0 20px ${colors.secondary}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative' as const,
    };

    return (
        <motion.div
            className={`marvel-avatar ${className}`}
            style={containerStyle}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <svg
                width={size * 0.8}
                height={size * 0.8}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {hero === 'tech' && (
                    <g id="tech-hero">
                        {/* Iron Man Style Mask */}
                        <path d="M20 10 L80 10 L90 30 L80 90 L50 100 L20 90 L10 30 Z" fill={colors.secondary} />
                        <path d="M25 20 L75 20 L80 35 L50 90 L20 35 Z" fill={colors.primary} />
                        {/* Eyes */}
                        <rect x="30" y="40" width="15" height="4" fill={colors.accent} className="animate-pulse" />
                        <rect x="55" y="40" width="15" height="4" fill={colors.accent} className="animate-pulse" />
                        {/* Arc Details */}
                        <circle cx="50" cy="75" r="5" fill={colors.accent} fillOpacity="0.8" className="animate-pulse" />
                    </g>
                )}

                {hero === 'soldier' && (
                    <g id="soldier-hero">
                        {/* Cap Helmet */}
                        <path d="M20 20 C20 0, 80 0, 80 20 V60 C80 80, 50 100, 50 100 C50 100, 20 80, 20 60 Z" fill={colors.primary} />
                        {/* A Symbol */}
                        <text x="50" y="45" fontSize="25" textAnchor="middle" fill={colors.secondary} fontWeight="bold" style={{ fontFamily: 'Arial' }}>A</text>
                        {/* Eye Holes */}
                        <path d="M30 50 Q40 55 50 50 Q60 55 70 50" stroke={colors.secondary} strokeWidth="2" fill="none" />
                        {/* Wing Accents */}
                        <path d="M15 35 L5 30 L15 25" stroke={colors.secondary} strokeWidth="3" fill="none" />
                        <path d="M85 35 L95 30 L85 25" stroke={colors.secondary} strokeWidth="3" fill="none" />
                    </g>
                )}

                {hero === 'web' && (
                    <g id="web-hero">
                        {/* Spidey Head */}
                        <ellipse cx="50" cy="50" rx="35" ry="45" fill={colors.primary} />
                        {/* Web Pattern */}
                        <path d="M50 50 L50 5 M50 50 L85 50 M50 50 L50 95 M50 50 L15 50 M50 50 L75 25 M50 50 L75 75 M50 50 L25 75 M50 50 L25 25" stroke={colors.secondary} strokeWidth="1" strokeOpacity="0.5" />
                        {/* Eyes */}
                        <path d="M30 40 Q45 50 30 65 Q15 50 30 40" fill={colors.accent} stroke={colors.secondary} strokeWidth="3" />
                        <path d="M70 40 Q55 50 70 65 Q85 50 70 40" fill={colors.accent} stroke={colors.secondary} strokeWidth="3" />
                    </g>
                )}

                {hero === 'thunder' && (
                    <g id="thunder-hero">
                        {/* Thor Helmet Base */}
                        <circle cx="50" cy="40" r="30" fill={colors.primary} />
                        {/* Wings */}
                        <path d="M20 30 L5 10 L20 20 Z" fill={colors.secondary} />
                        <path d="M80 30 L95 10 L80 20 Z" fill={colors.secondary} />
                        {/* Beard/Chin */}
                        <path d="M35 60 Q50 80 65 60" fill={colors.secondary} />
                        {/* Lightning Effect */}
                        <path d="M45 5 L55 5 L50 15 L60 15 L45 35 L50 20 L40 20 Z" fill={colors.accent} className="animate-pulse" />
                    </g>
                )}
            </svg>
        </motion.div>
    );
}
