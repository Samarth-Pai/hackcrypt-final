import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import CosmicBackground from "@/components/ui/CosmicBackground";


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


        <CosmicBackground />

        {/* Content Layer */}
        {children}
      </body>
    </html>
  );
}
