'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Sparkles, Shield } from 'lucide-react';
import SyllabusCard, { SyllabusStatus } from './SyllabusCard';
import TopicContent, { TopicData } from './TopicContent';

const SYLLABUS_DATA: TopicData[] = [
    {
        id: 'cyber-fundamentals',
        title: 'Operation: Cyber Genesis',
        description: 'Initialize S.H.I.E.L.D. recruit training. Covert communication basics, CIA triad protocols, and threat vectors.',
        status: 'completed' as SyllabusStatus,
        sections: [
            {
                title: 'The CIA Triad Protocols',
                content: [
                    'Confidentiality: Protecting asset data from unauthorized Hydra access.',
                    'Integrity: Ensuring data streams remain uncorrupted.',
                    'Availability: Guaranteeing mission-critical system uptime.'
                ]
            },
            {
                title: 'Threat Vector Analysis',
                content: [
                    'Phishing: Identifying deceptive communication.',
                    'Malware: Neutralizing malicious code variants.',
                    'Social Engineering: Countering psychological manipulation.'
                ]
            }
        ]
    },
    {
        id: 'cryptography-101',
        title: 'Project: Enigma Code',
        description: 'Advanced encryption techniques. Master the arts of hashing, digital signatures, and securing the Grid.',
        status: 'in_progress' as SyllabusStatus,
        sections: [
            {
                title: 'Encryption Paradigms',
                content: [
                    'Symmetric: High-speed tactical encryption.',
                    'Asymmetric: Public/Private key exchange protocols.',
                    'Strategic deployment of AES and RSA algorithms.'
                ]
            },
            {
                title: 'Hashing Integrity',
                content: [
                    'One-way data transformation verification.',
                    'Validating mission data integrity.',
                    'Algorithm analysis: SHA-256 vs legacy MD5.'
                ]
            }
        ]
    },
    {
        id: 'network-defense',
        title: 'Stark Perimeter Defense',
        description: 'Deploying Firewalls, IDS/IPS grids, and securing the network architecture against invasion.',
        status: 'locked' as SyllabusStatus,
        sections: []
    },
    {
        id: 'ethical-hacking',
        title: 'Widow\'s Infiltration',
        description: 'Offensive security reconnaissance, scanning, and vulnerability assessment methods.',
        status: 'locked' as SyllabusStatus,
        sections: []
    }
];

export default function SyllabusSection() {
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

    const selectedTopic = SYLLABUS_DATA.find(t => t.id === selectedTopicId);

    return (
        <div className="mt-8 relative z-10 font-sans">
            {/* Marvel Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse" />
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-900 to-black border border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] relative z-10">
                        <Map size={32} />
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                        MISSION DIRECTIVES
                    </h2>
                    <p className="text-xs text-cyan-500/80 font-mono tracking-[0.2em] flex items-center gap-2 mt-1">
                        <Shield size={12} /> S.H.I.E.L.D. CLEARANCE: LEVEL 4
                    </p>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 via-cyan-900/20 to-transparent ml-6" />
            </div>

            {/* Campaign Grid with Connecting Lines */}
            <div className="relative">
                {/* Connecting Background Line - stylized as a circuit trace */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-slate-800 -translate-y-1/2 hidden lg:block opacity-30 blur-[2px]" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {SYLLABUS_DATA.map((topic, idx) => (
                        <SyllabusCard
                            key={topic.id}
                            id={topic.id}
                            title={topic.title}
                            description={topic.description}
                            status={topic.status as SyllabusStatus}
                            onClick={setSelectedTopicId}
                            delay={idx * 0.15}
                        />
                    ))}
                </div>
            </div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {selectedTopic && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTopicId(null)}
                            className="absolute inset-0 bg-[#050510]/95 backdrop-blur-xl"
                        />

                        <motion.div
                            layoutId={selectedTopic.id}
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative z-10 w-full max-w-3xl"
                        >
                            <div className="border border-cyan-500/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.25)] bg-[#0A0A1F] relative">
                                {/* Tech overlay lines */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-transparent" />

                                <TopicContent
                                    topic={selectedTopic}
                                    onClose={() => setSelectedTopicId(null)}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
