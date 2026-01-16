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
    switch (delta) {
      case 0:
        return "z-30 mb-10 scale-150 md:scale-[1.8] hover:scale-[2.0] translate-x-0 opacity-100 grayscale-0 brightness-100";
      case 4:
        return "z-20 bottom-[20%] left-[25%] md:left-[28%] scale-100 hover:scale-110 opacity-80";
      case 3:
        return "z-10 bottom-[10%] left-[5%] md:left-[10%] scale-90 hover:scale-105 opacity-60";
      case 2:
        return "z-0 bottom-[10%] right-[5%] md:right-[10%] scale-75 opacity-0";
      case 1:
        return "z-20 bottom-[20%] right-[25%] md:right-[28%] scale-100 hover:scale-110 opacity-80";
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
            COSMIC_CYPHER
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
        <div className="text-center mb-24 space-y-6 max-w-4xl mx-auto relative">
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
        </div>

        {/* Grand Stones Constellation (Carousel Layout) */}
        <div className="relative w-full max-w-7xl h-[600px] flex items-end justify-center perspective-1000 pb-20">

          {/* Connecting Lines */}
          <svg className="absolute inset-x-0 bottom-0 h-full w-full pointer-events-none opacity-20">
            <defs>
              <linearGradient id="beamGrad" x1="0.5" y1="1" x2="0.5" y2="0">
                <stop offset="0%" stopColor="#00F3FF" stopOpacity="0.5" />
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
                className={`absolute transition-all duration-1000 ease-in-out ${getPositionStyles(delta)}`}
              >
                {isCenter && (
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-[80px] group-hover:blur-[120px] group-hover:bg-cyan-400/30 transition-all duration-500 animate-pulse -z-10" />
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

      </main>
    </div>
  );
}
