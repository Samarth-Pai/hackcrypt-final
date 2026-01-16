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
        ${glowStyles[glow]}
        ${className}
      `}
        >
            {/* Decorative top sheen */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {title && (
                <div className="px-6 py-4 border-b border-slate-800/50">
                    <h3 className="font-sans text-lg font-semibold tracking-wide text-white">
                        {title}
                    </h3>
                </div>
            )}

            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default CosmicCard;
