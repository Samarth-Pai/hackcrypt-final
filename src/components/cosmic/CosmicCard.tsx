import React from 'react';

interface CosmicCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    glow?: 'cyan' | 'violet' | 'blue' | 'none';
}

const CosmicCard: React.FC<CosmicCardProps> = ({
    children,
    className = '',
    title,
    glow = 'none'
}) => {
    const glowStyles = {
        cyan: 'shadow-[0_0_20px_rgba(0,243,255,0.15)] border-cyan-500/30',
        violet: 'shadow-[0_0_20px_rgba(157,0,255,0.15)] border-violet-500/30',
        blue: 'shadow-[0_0_20px_rgba(46,81,255,0.15)] border-blue-500/30',
        none: 'border-slate-700/50 hover:border-slate-600/50'
    };

    return (
        <div
            className={`
        relative overflow-hidden rounded-xl 
        bg-slate-900/60 backdrop-blur-xl 
        border transition-all duration-300
        group
        ${glowStyles[glow]}
        ${className}
      `}
        >
            {/* HUD Top-Left Corner */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            {/* HUD Bottom-Right Corner */}
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-violet-500/50 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Scanline Effect (Subtle) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] pointer-events-none bg-[length:100%_4px,3px_100%] opacity-20" />

            {/* Decorative top sheen */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

            {title && (
                <div className="px-6 py-4 border-b border-white/10 relative z-10">
                    <h3 className="font-sans text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase">
                        {title}
                    </h3>
                </div>
            )}

            <div className="p-6 relative z-10">
                {children}
            </div>
        </div>
    );
};

export default CosmicCard;
