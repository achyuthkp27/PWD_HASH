import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface NeonButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    ...props
}) => {
    const baseStyles = "relative inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neon-bg disabled:opacity-50 disabled:cursor-not-allowed border overflow-hidden group";

    const variants = {
        primary: "bg-neon-green/5 border-neon-green text-neon-green hover:bg-neon-green hover:text-black hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] focus:ring-neon-green backdrop-blur-sm",
        secondary: "bg-neon-cyan/5 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] focus:ring-neon-cyan backdrop-blur-sm",
        danger: "bg-red-500/5 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] focus:ring-red-500 backdrop-blur-sm",
        ghost: "bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5",
    };

    const sizes = {
        sm: "text-xs px-3 py-1.5 rounded-lg",
        md: "text-sm px-6 py-3 rounded-xl",
        lg: "text-base px-10 py-4 rounded-2xl",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={twMerge(baseStyles, variants[variant], sizes[size], className)}
            disabled={isLoading || disabled}
            {...props}
        >
            {/* Background gradient sweep effect */}
            {variant !== 'ghost' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            )}

            {isLoading && (
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </span>
            )}
            <span className={clsx(isLoading && "invisible", "relative z-10 flex items-center")}>
                {children as React.ReactNode}
            </span>
        </motion.button>
    );
};
