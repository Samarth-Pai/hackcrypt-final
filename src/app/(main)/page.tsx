'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cpu, Sparkles } from 'lucide-react';
import InfinityStone from '@/components/cosmic/InfinityStone';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const enterSyllabus = () => {
    router.push('/syllabus');
  };

  const STONES = [
    { id: 'center', label: 'CS FUNDAMENTALS', src: '/assets/cosmic/stone-ai.png', color: '#00F3FF', locked: false, onClick: enterSyllabus },
    { id: 'mid-left', label: 'CHEMISTRY', src: '/assets/cosmic/stone-data.png', color: '#f472b6', locked: true },
    { id: 'far-left', label: 'MATHEMATICS', src: '/assets/cosmic/stone-algo.png', color: '#fbbf24', locked: true },
    { id: 'far-right', label: 'BIOLOGY', src: '/assets/cosmic/stone-networks.png', color: '#22c55e', locked: true },
    { id: 'mid-right', label: 'PHYSICS', src: '/assets/cosmic/stone-security.png', color: '#a855f7', locked: true },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 5);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const getPositionStyles = (delta: number) => {
    // Holographic Transitions
    const baseTransition = "absolute transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[transform,opacity,filter]";

    switch (delta) {
      case 0: // Center (Active)
        return `${baseTransition} z-30 mb-10 scale-[1.4] md:scale-[1.6] opacity-100 brightness-125 drop-shadow-[0_0_30px_rgba(0,243,255,0.5)] translate-x-0 grayscale-0 mix-blend-normal`;
      case 1: // Right Near
        return `${baseTransition} z-20 bottom-[20%] right-[20%] md:right-[25%] scale-75 opacity-40 blur-[2px] grayscale-[50%] mix-blend-screen pointer-events-none`;
      case 4: // Left Near
        return `${baseTransition} z-20 bottom-[20%] left-[20%] md:left-[25%] scale-75 opacity-40 blur-[2px] grayscale-[50%] mix-blend-screen pointer-events-none`;
      case 2: // Right Far
        return `${baseTransition} z-10 bottom-[10%] right-[10%] md:right-[15%] scale-40 opacity-0 blur-[10px] pointer-events-none`;
      case 3: // Left Far
        return `${baseTransition} z-10 bottom-[10%] left-[10%] md:left-[15%] scale-40 opacity-0 blur-[10px] pointer-events-none`;
      default:
        return "hidden";
    }
  };

  return (
    <div className="min-h-screen text-slate-100 overflow-hidden relative selection:bg-cyan-500/30">

      {/* Navigation */}
      <nav className="relative z-50 p-6 max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/30 flex items-center justify-center group-hover:border-cyan-400/60 group-hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all duration-300">
            <Cpu className="text-violet-400 group-hover:text-cyan-400 transition-colors" size={24} />
          </div>
          <span className="text-2xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 group-hover:to-cyan-300 transition-all">
            CogniArena
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            Login
          </Link>
          <Link href="/signup" className="group px-8 py-3 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-sm font-black uppercase tracking-widest relative overflow-hidden transition-all hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]">
            <span className="relative z-10 group-hover:text-white transition-colors">Initialize</span>
            <div className="absolute inset-0 bg-cyan-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
        </div>
      </nav>

      {/* Main Hero & Stones */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4 pb-20">

        {/* Text Content */}
        <div className="text-center mb-12 space-y-6 max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/5 text-violet-300 text-[10px] uppercase tracking-[0.3em] font-bold mb-4 animate-pulse"
          >
            <Sparkles size={12} className="text-cyan-400" />
            <span>System Online v2.0 • Sector 4</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-500 mb-4 drop-shadow-2xl"
          >
            UNLOCK THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">COSMOS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Plot your course across the cosmic curriculum.
            <br className="hidden md:block" />
            Choose a mission and begin your mastery arc.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/signup"
              className="group px-8 py-3 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 text-sm font-black uppercase tracking-widest relative overflow-hidden transition-all hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]"
            >
              <span className="relative z-10 group-hover:text-white transition-colors">Start Mission</span>
              <div className="absolute inset-0 bg-cyan-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <Link
              href="/syllabus"
              className="px-6 py-3 rounded-full border border-violet-500/30 bg-violet-950/20 text-violet-300 text-sm font-black uppercase tracking-widest hover:text-white hover:border-violet-400/80 transition-all"
            >
              Explore Syllabus
            </Link>
          </motion.div>
        </div>

        {/* Grand Stones Constellation (Carousel Layout) */}
        <div className="relative w-full max-w-7xl h-[450px] flex items-end justify-center perspective-[1200px] pb-10">

          {/* Connecting Lines */}
          <svg className="absolute inset-x-0 bottom-0 h-full w-full pointer-events-none opacity-30 mix-blend-screen">
            <defs>
              <linearGradient id="beamGrad" x1="0.5" y1="1" x2="0.5" y2="0">
                <stop offset="0%" stopColor="#00F3FF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path d="M50% 100% L50% 20%" stroke="url(#beamGrad)" strokeWidth="2" />
            <path d="M30% 100% L35% 30%" stroke="url(#beamGrad)" strokeWidth="1" />
            <path d="M70% 100% L65% 30%" stroke="url(#beamGrad)" strokeWidth="1" />
            <path d="M10% 100% L20% 40%" stroke="url(#beamGrad)" strokeWidth="1" />
            <path d="M90% 100% L80% 40%" stroke="url(#beamGrad)" strokeWidth="1" />
          </svg>

          {STONES.map((stone, index) => {
            const delta = (index - activeIndex + 5) % 5;
            const isCenter = delta === 0;

            return (
              <div
                key={stone.id}
                className={getPositionStyles(delta)}
              >
                {/* Holographic Projection Base */}
                {isCenter && (
                  <>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-32 h-8 bg-cyan-400/20 blur-xl rounded-[100%] pointer-events-none" />
                    <div className="absolute inset-0 bg-cyan-400/10 rounded-full blur-md animate-pulse mix-blend-screen pointer-events-none" />
                  </>
                )}

                <InfinityStone
                  label={stone.label}
                  imageSrc={stone.src}
                  color={stone.color}
                  locked={stone.locked && !isCenter}
                  onClick={stone.onClick}
                  delay={0}
                />
              </div>
            );
          })}

        </div>

        {/* Quick Stats */}
        <div className="w-full max-w-5xl mx-auto mt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Learners', value: '12,480+' },
              { label: 'Quests', value: '320+' },
              { label: 'Accuracy Boost', value: '38%' },
              { label: 'Active Streaks', value: '4,920' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl text-center"
              >
                <p className="text-xl md:text-2xl font-black text-white">{item.value}</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Strip */}
        <section className="w-full max-w-6xl mx-auto mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Adaptive Missions',
                body: 'Dynamic quests that tune difficulty in real time based on your performance.',
              },
              {
                title: 'Story-Driven Learning',
                body: 'Narrative arcs that turn every syllabus unit into a cinematic mission.',
              },
              {
                title: 'Live Duels',
                body: 'Challenge rivals in real-time and climb the global leaderboard.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-3xl border border-cyan-500/20 bg-cyan-950/10 hover:border-cyan-400/50 transition-all"
              >
                <h3 className="text-lg font-bold text-cyan-200 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full max-w-6xl mx-auto mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-white">How it works</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-bold">3 steps</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Choose a Path', body: 'Pick a subject and unlock your first quest line.' },
              { step: '02', title: 'Complete Missions', body: 'Finish story quests, quizzes, and challenges.' },
              { step: '03', title: 'Level Up', body: 'Earn XP, unlock badges, and climb the ranks.' },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl"
              >
                <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">Step {item.step}</p>
                <h3 className="text-lg font-bold text-white mt-2">{item.title}</h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full max-w-6xl mx-auto mt-16">
          <div className="p-8 md:p-10 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-950/40 to-violet-950/40 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white">Ready to enter the arena?</h3>
              <p className="text-sm text-slate-300 mt-2">Start your first quest and unlock the cosmic curriculum.</p>
            </div>
            <Link
              href="/signup"
              className="group px-10 py-4 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 text-sm font-black uppercase tracking-widest relative overflow-hidden transition-all hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]"
            >
              <span className="relative z-10 group-hover:text-white transition-colors">Begin Journey</span>
              <div className="absolute inset-0 bg-cyan-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
