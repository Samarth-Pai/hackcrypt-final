'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkillRadarGraphProps {
    stats: {
        intel: number;
        tech: number;
        combat: number;
        speed: number;
        defense: number;
    };
    color?: string;
}

export default function SkillRadarGraph({ stats, color = '#22d3ee' }: SkillRadarGraphProps) {
    // Labels corresponding to the 5 points
    const labels = ['INTEL', 'TECH', 'COMBAT', 'SPEED', 'DEFENSE'];
    const dataValues = [stats.intel, stats.tech, stats.combat, stats.speed, stats.defense];

    // Config
    const SIZE = 200;
    const CENTER = SIZE / 2;
    const RADIUS = 80;
    const TOTAL_POINTS = 5;

    // Helper to calculate point coordinates
    const getPoint = (value: number, index: number, maxRadius: number) => {
        const angle = (Math.PI * 2 * index) / TOTAL_POINTS - Math.PI / 2;
        const normalizedValue = value / 100; // Assuming stats are 0-100
        const x = CENTER + Math.cos(angle) * (maxRadius * normalizedValue);
        const y = CENTER + Math.sin(angle) * (maxRadius * normalizedValue);
        return { x, y };
    };

    // Generate path for the data polygon
    const points = dataValues.map((val, i) => {
        const p = getPoint(val, i, RADIUS);
        return `${p.x},${p.y}`;
    }).join(' ');

    // Generate grid rings
    const rings = [0.25, 0.5, 0.75, 1].map(scale => {
        return Array.from({ length: TOTAL_POINTS }).map((_, i) => {
            const p = getPoint(100, i, RADIUS * scale);
            return `${p.x},${p.y}`;
        }).join(' ');
    });

    return (
        <div className="relative w-full aspect-square max-w-[300px] mx-auto flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-cyan-500/10 blur-3xl opacity-50" />

            <svg width="100%" height="100%" viewBox={`0 0 ${SIZE} ${SIZE}`} className="relative z-10 overflow-visible">
                {/* Background Grid Rings */}
                {rings.map((ringPoints, i) => (
                    <polygon
                        key={i}
                        points={ringPoints}
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                        strokeDasharray={i === 3 ? "0" : "4 4"}
                    />
                ))}

                {/* Axis Lines */}
                {Array.from({ length: TOTAL_POINTS }).map((_, i) => {
                    const p = getPoint(100, i, RADIUS);
                    return (
                        <line
                            key={i}
                            x1={CENTER}
                            y1={CENTER}
                            x2={p.x}
                            y2={p.y}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data Polygon */}
                <motion.polygon
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    points={points}
                    fill={color}
                    fillOpacity="0.2"
                    stroke={color}
                    strokeWidth="2"
                    filter="url(#glow)"
                />

                {/* Data Points */}
                {dataValues.map((val, i) => {
                    const p = getPoint(val, i, RADIUS);
                    return (
                        <motion.circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r="3"
                            fill="#fff"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                        />
                    );
                })}

                {/* Labels */}
                {labels.map((label, i) => {
                    const p = getPoint(120, i, RADIUS); // Push labels out slightly
                    return (
                        <text
                            key={i}
                            x={p.x}
                            y={p.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="rgba(255,255,255,0.7)"
                            fontSize="8"
                            fontWeight="bold"
                            letterSpacing="1px"
                        >
                            {label}
                        </text>
                    );
                })}

                {/* Definitions */}
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>
        </div>
    );
}
