import React from 'react';
import logo from '../assets/logo.png';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Header: React.FC = () => {
    const { scrollY } = useScroll();
    const bgOpacity = useTransform(scrollY, [0, 50], [0, 0.8]);
    const blur = useTransform(scrollY, [0, 50], [0, 12]);
    const borderColor = useTransform(scrollY, [0, 50], ['rgba(0,0,0,0)', 'rgba(30, 41, 59, 0.5)']);

    return (
        <motion.header
            style={{
                backgroundColor: useTransform(bgOpacity, o => `rgba(2, 4, 10, ${o})`),
                backdropFilter: useTransform(blur, b => `blur(${b}px)`),
                borderBottomColor: borderColor,
                borderBottomWidth: 1,
                borderBottomStyle: 'solid'
            }}
            className="sticky top-0 z-50 transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={logo} alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
                            CRYPTO <span className="text-neon-cyan text-xs font-mono border border-neon-cyan/50 px-1 py-0.5 rounded bg-neon-cyan/10">STUDIO</span>
                        </h1>
                    </div>
                </div>

                <nav className="flex items-center gap-6">
                    {/* Cleaned up nav */}
                </nav>
            </div>
        </motion.header>
    );
};
