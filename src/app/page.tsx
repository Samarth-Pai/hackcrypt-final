'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cpu, Star } from 'lucide-react';
import InfinityStone from '@/components/cosmic/InfinityStone';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  const enterWorld = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-hidden relative selection:bg-cyan-500/30">
      {/* Cosmic Noise / Stars Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_100%)] z-10" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/40 via-[#020617] to-[#020617]" />

        {/* Animated Stars (Simulated with simple divs for performance) */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            initial={{ opacity: 0.1, scale: 0.5 }}
            animate={{ opacity: [0.1, 0.5, 0.1], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6 max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-10 h-10 rounded-lg bg-violet-600/10 border border-violet-500/30 flex items-center justify-center group-hover:border-violet-400/60 transition-colors">
            <Cpu className="text-violet-400" size={20} />
          </div>
          <span className="text-xl font-bold font-mono tracking-tighter text-slate-100 group-hover:text-violet-300 transition-colors">
            COSMIC_CYPHER
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/signup" className="px-6 py-2 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-sm font-bold uppercase tracking-widest hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
            Initialize
          </Link>
        </div>
      </nav>

      {/* Main Hero & Stones */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4 pb-20">

        {/* Text Content */}
        <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/5 text-violet-300 text-[10px] uppercase tracking-[0.2em] mb-4"
          >
            <Star size={12} fill="currentColor" />
            <span>System Online v2.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-2"
          >
            Unlock Knowledge.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto font-light"
          >
            Master one domain at a time. The universe awaits your command.
          </motion.p>
        </div>

        {/* Stones Grid / Constellation */}
        <div className="relative w-full max-w-5xl h-[400px] md:h-[500px] flex items-center justify-center perspective-1000">

          {/* Connecting Lines (Decorative) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <line x1="50%" y1="50%" x2="20%" y2="30%" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50%" y1="50%" x2="20%" y2="70%" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50%" y1="50%" x2="80%" y2="70%" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
          </svg>

          {/* Central AI Stone */}
          <div className="relative z-30 scale-125 md:scale-150">
            <InfinityStone
              label="AI_STONE"
              color="#00F3FF"
              onClick={enterWorld}
              delay={0.6}
            />
            <div className="absolute top-full mt-8 left-1/2 -translate-x-1/2 text-center w-max animate-pulse">
              <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-bold">Click to Enter</p>
            </div>
          </div>

          {/* Satellites / Locked Stones */}
          <div className="absolute top-[10%] left-[10%] md:left-[20%] z-20 scale-75 md:scale-90">
            <InfinityStone locked label="DATA_CORE" color="#f472b6" delay={0.8} />
          </div>

          <div className="absolute top-[10%] right-[10%] md:right-[20%] z-20 scale-75 md:scale-90">
            <InfinityStone locked label="SECURITY" color="#a855f7" delay={1.0} />
          </div>

          <div className="absolute bottom-[10%] left-[10%] md:left-[20%] z-20 scale-75 md:scale-90">
            <InfinityStone locked label="ALGORITHMS" color="#fbbf24" delay={1.2} />
          </div>

          <div className="absolute bottom-[10%] right-[10%] md:right-[20%] z-20 scale-75 md:scale-90">
            <InfinityStone locked label="NETWORKS" color="#22c55e" delay={1.4} />
          </div>
        </div>

      </main>
    </div>
  );
}
