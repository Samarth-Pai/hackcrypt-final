
'use client';

import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, motion, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
    value: number;
    className?: string;
    duration?: number;
}

export default function AnimatedNumber({ value, className, duration = 2 }: AnimatedNumberProps) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    const springValue = useSpring(count, {
        damping: 30,
        stiffness: 100,
    });

    useEffect(() => {
        count.set(value);
    }, [value, count]);

    return <motion.span className={className}>{rounded}</motion.span>;
}
