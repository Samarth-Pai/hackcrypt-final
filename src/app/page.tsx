import Link from 'next/link';
import { Leaf, Sprout, Gamepad2, Trophy } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#3E2723] text-[#ededed] overflow-hidden">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Leaf className="w-8 h-8 text-[#2E7D32]" />
          <span className="text-2xl font-bold font-mono tracking-tighter text-[#C6FF00]">EduQuest</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 rounded-full border border-[#2E7D32] hover:bg-[#2E7D32]/20 transition-colors font-semibold">
            Login
          </Link>
          <Link href="/signup" className="px-6 py-2 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white transition-colors font-bold shadow-lg shadow-[#2E7D32]/50">
            Sign Up as Explorer
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD600]/10 border border-[#FFD600] rounded-full text-[#FFD600] text-sm font-bold">
            <Sprout className="w-4 h-4" />
            <span>Cultivate Your Knowledge</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-[#ededed]">
            Turn Studying into an <span className="text-[#C6FF00]">Adventure</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-lg">
            Explore a world where quizzes are quests, grades are gold, and learning feels like playing your favorite RPG.
          </p>
          <div className="flex gap-4 pt-4">
            <Link href="/signup" className="px-8 py-4 bg-[#FFD600] hover:bg-[#FFAB00] text-[#3E2723] rounded-xl font-bold text-lg shadow-xl hover:translate-y-1 transition-all flex items-center gap-2">
              <Gamepad2 className="w-6 h-6" />
              Start Your Journey
            </Link>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="flex-1 relative">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#2E7D32] rounded-full blur-[100px] opacity-30"></div>
          <div className="relative bg-[#5D4037]/50 border border-[#2E7D32] backdrop-blur-md p-8 rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-[#3E2723] rounded-xl border border-[#C6FF00]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Leaf className="w-6 h-6 text-[#2E7D32]" />
                  <span className="font-bold">Biology 101: Cell Structure</span>
                </div>
                <span className="text-[#C6FF00] font-mono">+50 XP</span>
              </div>
              <div className="p-4 bg-[#3E2723] rounded-xl border border-[#FFD600]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-[#FFD600]" />
                  <span className="font-bold">Weekly Challenge</span>
                </div>
                <span className="text-[#FFD600] font-mono">Top 5%</span>
              </div>
              <div className="h-2 bg-[#1B1B1B] rounded-full overflow-hidden">
                <div className="h-full bg-[#C6FF00] w-[70%]"></div>
              </div>
              <p className="text-right text-xs text-[#C6FF00]">Level 4 Explorer</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        Built for HackCrypt 3.0 • The Overgrown Adventure Theme
      </footer>
    </div>
  );
}
