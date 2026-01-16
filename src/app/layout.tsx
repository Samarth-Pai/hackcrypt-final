import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import TopNav from '@/components/layout/TopNav';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "CosmicCypher | Educational Platform",
  description: "Master knowledge in a universe of learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} font-sans antialiased text-slate-100 min-h-screen relative overflow-x-hidden`}
        style={{
          background: 'var(--color-cosmic-bg)',
          color: 'var(--color-text-primary)'
        }}
      >
        {/* Cosmic Background System */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-30" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-30" />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <TopNav />
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
