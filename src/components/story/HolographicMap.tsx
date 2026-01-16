"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Hexagon, Lock, MapPin, ChevronRight, Share2, Shield, Target } from 'lucide-react';
import type { StoryGroup } from '@/lib/stories';

interface Node {
    slug: string;
    x: number;
    y: number;
    title?: string;
}

interface HolographicMapProps {
    nodes: Node[];
    storyGroups: StoryGroup[];
}

const HolographicMap: React.FC<HolographicMapProps> = ({ nodes, storyGroups }) => {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    return (
        <div className="relative w-full h-[600px] [perspective:2000px] overflow-visible group/map select-none">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-cyan-900/5 blur-[100px] rounded-full opacity-50 pointer-events-none" />

            {/* 3D Plane */}
            <div
                className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700 ease-out group-hover/map:[transform:rotateX(20deg)_scale(0.95)]"
                style={{ transform: 'rotateX(25deg) scale(0.9)' }}
            >
                {/* Grid Floor */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:40px_40px] border border-cyan-500/20 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)_inset] backdrop-blur-[1px]">
                    {/* Scanning Line Animation */}
                    <motion.div
                        className="absolute inset-x-0 h-[40%] bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent border-b border-cyan-400/20"
                        animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Decoration Circles */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-cyan-500/10 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border border-dashed border-cyan-500/10 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
                </div>

                {/* Nodes */}
                {nodes.map((node) => {
                    const group = storyGroups.find((g) => g.syllabusSlug === node.slug);
                    const isHovered = hoveredNode === node.slug;
                    if (!group) return null;

                    return (
                        <div
                            key={node.slug}
                            className="absolute [transform-style:preserve-3d]"
                            style={{
                                left: `${node.x}%`,
                                top: `${node.y}%`,
                                transform: 'translate(-50%, -50%) translateZ(10px)'
                            }}
                            onMouseEnter={() => setHoveredNode(node.slug)}
                            onMouseLeave={() => setHoveredNode(null)}
                        >
                            <Link href={`/story/${node.slug}`} className="block relative group/node">
                                {/* Base Pulse */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl opacity-0 group-hover/node:opacity-100 transition-opacity duration-500 animate-pulse" />

                                {/* Connecting Line to Floor */}
                                <div className="absolute top-1/2 left-1/2 w-[1px] h-[60px] bg-gradient-to-b from-cyan-400/50 to-transparent origin-top transform -rotate-x-90 translate-y-4 opacity-50" />

                                {/* Node Icon Container */}
                                <motion.div
                                    className={`relative z-10 w-16 h-16 flex items-center justify-center rounded-xl border-2 backdrop-blur-md transition-all duration-300 ${isHovered ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)]' : 'bg-slate-900/60 border-cyan-500/30 text-cyan-500/50'}`}
                                    animate={{
                                        y: isHovered ? -20 : 0,
                                        scale: isHovered ? 1.1 : 1
                                    }}
                                >
                                    <Hexagon size={isHovered ? 32 : 28} className={`transition-colors ${isHovered ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'text-cyan-500/50'}`} strokeWidth={1.5} />
                                    <div className="absolute inset-0 border border-cyan-400/30 rounded-xl animate-ping opacity-20" />
                                </motion.div>

                                {/* Hover Info Card (Projected) */}
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                            animate={{ opacity: 1, y: -90, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                            className="absolute left-1/2 -translate-x-1/2 w-64 bg-slate-900/90 border border-cyan-500/50 rounded-lg p-3 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.3)] z-50 pointer-events-none"
                                        >
                                            {/* Tech Deco Lines */}
                                            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-cyan-400" />
                                            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-cyan-400" />
                                            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-cyan-400" />
                                            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-cyan-400" />

                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="text-cyan-200 font-bold text-sm leading-tight uppercase tracking-wide">{group.syllabusTitle}</h3>
                                                <div className="bg-cyan-500/20 px-1.5 py-0.5 rounded text-[10px] text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
                                                    {group.stories.length} Missions
                                                </div>
                                            </div>

                                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                                                <div className="h-full bg-cyan-400 w-1/3 shadow-[0_0_10px_cyan]" />
                                            </div>

                                            <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                                                <Target size={10} className="text-cyan-500" />
                                                <span>Sector {node.slug.split('-')[0]}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* Overlay Grid / HUD */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none opacity-50">
                <div className="flex items-center gap-2 text-cyan-500/60 text-[10px] font-mono">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    SYSTEM ONLINE
                </div>
                <div className="text-[10px] text-cyan-500/40 font-mono">
                    COORDINATES: {hoveredNode ? hoveredNode.toUpperCase() : 'SCANNING...'}
                </div>
            </div>
        </div>
    );
};

export default HolographicMap;
