'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Sparkles, BookOpen, Map, Swords, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
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

      {/* Main Hero */}
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

        {/* Mission Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          <Link href="/syllabus" className="glass-cosmic rounded-2xl border border-cyan-500/30 p-6 hover:border-violet-500/60 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="text-cyan-300" size={22} />
              <h2 className="text-lg font-bold text-cyan-200">CS Fundamentals</h2>
            </div>
            <p className="text-sm text-slate-300">Start with the core syllabus and climb your mastery curve.</p>
          </Link>
          <Link href="/learning-path" className="glass-cosmic rounded-2xl border border-cyan-500/30 p-6 hover:border-violet-500/60 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Map className="text-violet-300" size={22} />
              <h2 className="text-lg font-bold text-violet-200">Learning Path</h2>
            </div>
            <p className="text-sm text-slate-300">Visualize your progression and unlock challenge nodes.</p>
          </Link>
          <Link href="/story" className="glass-cosmic rounded-2xl border border-cyan-500/30 p-6 hover:border-violet-500/60 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Compass className="text-blue-300" size={22} />
              <h2 className="text-lg font-bold text-blue-200">Story Map</h2>
            </div>
            <p className="text-sm text-slate-300">Embark on story missions by topic and syllabus.</p>
          </Link>
          <Link href="/duels" className="glass-cosmic rounded-2xl border border-cyan-500/30 p-6 hover:border-violet-500/60 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Swords className="text-rose-300" size={22} />
              <h2 className="text-lg font-bold text-rose-200">Live Duels</h2>
            </div>
            <p className="text-sm text-slate-300">Match with rivals in real-time knowledge battles.</p>
          </Link>
          <Link href="/dashboard" className="glass-cosmic rounded-2xl border border-cyan-500/30 p-6 hover:border-violet-500/60 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Cpu className="text-cyan-300" size={22} />
              <h2 className="text-lg font-bold text-cyan-200">Command Center</h2>
            </div>
            <p className="text-sm text-slate-300">Track performance, missions, and rewards.</p>
          </Link>
        </div>

      </main>
    </div>
  );
}
