import React from 'react';
import { type HTMLMotionProps, motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface NeonCardProps extends HTMLMotionProps<"div"> {
    color?: 'green' | 'cyan' | 'purple' | 'red' | 'yellow';
    noPadding?: boolean;
}

export const NeonCard: React.FC<NeonCardProps> = ({
    children,
    className,
    color = 'green',
    noPadding = false,
    ...props
}) => {
    const glowColors = {
        green: 'group-hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)] border-neon-green/20 group-hover:border-neon-green/50',
        cyan: 'group-hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.3)] border-neon-cyan/20 group-hover:border-neon-cyan/50',
        purple: 'group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] border-neon-purple/20 group-hover:border-neon-purple/50',
        red: 'group-hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)] border-red-500/20 group-hover:border-red-500/50',
        yellow: 'group-hover:shadow-[0_0_30px_-5px_rgba(234,179,8,0.3)] border-yellow-500/20 group-hover:border-yellow-500/50',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={twMerge(
                "group relative bg-white/[0.02] backdrop-blur-xl border rounded-2xl transition-all duration-500",
                glowColors[color],
                noPadding ? "p-0" : "p-6",
                className
            )}
            {...props}
        >
            {/* Corner accents - animated */}
            <div className={clsx("absolute top-0 left-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500")}>
                <div className={clsx("absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-current to-transparent", color === 'green' ? 'text-neon-green' : color === 'cyan' ? 'text-neon-cyan' : color === 'purple' ? 'text-neon-purple' : color === 'red' ? 'text-red-500' : 'text-yellow-500')} />
                <div className={clsx("absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-transparent via-current to-transparent", color === 'green' ? 'text-neon-green' : color === 'cyan' ? 'text-neon-cyan' : color === 'purple' ? 'text-neon-purple' : color === 'red' ? 'text-red-500' : 'text-yellow-500')} />
            </div>

            {/* Top light reflection */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {children as React.ReactNode}
        </motion.div>
    );
}
