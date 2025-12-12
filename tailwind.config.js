/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    green: '#22c55e',
                    cyan: '#22d3ee',
                    purple: '#a855f7',
                    bg: '#050816', // Deep charcoal/black
                    surface: '#0f172a',
                },
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.8s ease-out forwards',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                }
            }
        },
    },
    plugins: [],
}
