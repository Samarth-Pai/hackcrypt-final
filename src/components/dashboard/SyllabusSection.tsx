'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers } from 'lucide-react';
import SyllabusCard, { SyllabusStatus } from './SyllabusCard';
import TopicContent, { TopicData } from './TopicContent';
import CosmicCard from '@/components/cosmic/CosmicCard';

const SYLLABUS_DATA: TopicData[] = [
    {
        id: 'cyber-fundamentals',
        title: 'Cybersecurity Fundamentals',
        description: 'Core concepts of information security, CIA triad, and attack vectors.',
        status: 'completed',
        sections: [
            {
                title: 'The CIA Triad',
                content: [
                    'Confidentiality: Protecting information from unauthorized access.',
                    'Integrity: Ensuring data is accurate and unchanged.',
                    'Availability: Guaranteeing timely and reliable access to data.'
                ]
            },
            {
                title: 'Common Attack Vectors',
                content: [
                    'Phishing: Deceptive attempts to gather sensitive info.',
                    'Malware: Software designed to disrupt or damage systems.',
                    'Social Engineering: Manipulating people into breaking security procedures.'
                ]
            }
        ]
    },
    {
        id: 'cryptography-101',
        title: 'Cryptography 101',
        description: 'Introduction to encryption, hashing, and digital signatures.',
        status: 'in_progress',
        sections: [
            {
                title: 'Symmetric vs Asymmetric',
                content: [
                    'Symmetric: Same key for encryption and decryption (speed).',
                    'Asymmetric: Public/Private key pair (security/exchange).',
                    'Use AES for data at rest, RSA/ECC for key exchange.'
                ]
            },
            {
                title: 'Hashing Functions',
                content: [
                    'One-way transformation of data into a fixed string.',
                    'Crucial for password storage and data integrity verification.',
                    'Common algorithms: SHA-256, MD5 (legacy/insecure).'
                ]
            }
        ]
    },
    {
        id: 'network-defense',
        title: 'Network Defense',
        description: 'Firewalls, IDS/IPS, and securing network architecture.',
        status: 'locked',
        sections: [] // Locked content content usually hidden/empty until unlocked
    },
    {
        id: 'ethical-hacking',
        title: 'Ethical Hacking Basics',
        description: 'Reconnaissance, scanning, and vulnerability assessment.',
        status: 'locked',
        sections: []
    }
];

export default function SyllabusSection() {
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

    const selectedTopic = SYLLABUS_DATA.find(t => t.id === selectedTopicId);

    return (
        <div className="mt-8">
            <div className="flex items-center gap-3 mb-6">
                <Layers className="text-cyan-400" size={20} />
                <h2 className="text-xl font-black italic uppercase tracking-tighter text-slate-100">
                    Training Syllabus
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {SYLLABUS_DATA.map((topic, idx) => (
                    <SyllabusCard
                        key={topic.id}
                        id={topic.id}
                        title={topic.title}
                        description={topic.description}
                        status={topic.status}
                        onClick={setSelectedTopicId}
                        delay={idx * 0.1}
                    />
                ))}
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
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            layoutId={selectedTopic.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative z-10 w-full max-w-2xl"
                        >
                            <TopicContent
                                topic={selectedTopic}
                                onClose={() => setSelectedTopicId(null)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
