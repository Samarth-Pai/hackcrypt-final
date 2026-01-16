import type { Metadata } from "next";
import { Press_Start_2P, Pixelify_Sans } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start",
  subsets: ["latin"],
});

const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduQuest | Gamified Learning",
  description: "Master knowledge in an overgrown adventure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${pressStart.variable} ${pixelify.variable} antialiased font-sans bg-teal-bg text-gray-100 min-h-screen relative overflow-x-hidden`}
      >
        {/* Immersive Background System */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-teal-bg" />
          <div className="absolute inset-0 pixel-grid-v2 opacity-30" />
          <div className="absolute inset-0 neural-bg opacity-50" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-ai/50 to-transparent animate-scanline opacity-20" />
        </div>

        {/* Content Layer */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
