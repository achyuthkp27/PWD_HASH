import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { NeonCard } from '../components/ui/NeonCard';
import type { AlgorithmName, HashingParams } from '../lib/hashing/types';

interface CostTimeChartProps {
    algorithm: AlgorithmName;
    currentParams: HashingParams;
}

// Mock data generator for visualization
const getData = (algorithm: AlgorithmName, currentParams: HashingParams) => {
    const data = [];

    if (algorithm === 'bcrypt') {
        // x-axis: cost (4 to 16)
        // y-axis: time (exponential)
        // current cost
        const currentCost = (currentParams as any).cost;
        for (let i = 8; i <= 16; i++) {
            // approx time: 2^cost / 2^10 * 60ms (roughly)
            // baseline: cost 10 ~ 50ms
            const time = 50 * Math.pow(2, i - 10);
            data.push({
                name: i.toString(),
                cost: i,
                time: Math.round(time),
                isCurrent: i === currentCost
            });
        }
    } else if (algorithm === 'argon2') {
        // Varying time iterations
        const currentIter = (currentParams as any).time;
        for (let i = 1; i <= 10; i++) {
            data.push({
                name: i.toString(),
                time: i * 50, // mock linear scaling
                isCurrent: i === currentIter
            });
        }
    } else if (algorithm === 'pbkdf2') {
        const currentIter = (currentParams as any).iterations;
        // Steps: 10k to 1M
        for (let i = 10000; i <= 1000000; i += 100000) {
            data.push({
                name: (i / 1000).toFixed(0) + 'k',
                time: i / 2000,
                isCurrent: Math.abs(i - currentIter) < 50000 // approx check
            });
        }
    } else {
        // Scrypt: N
        const currentN = (currentParams as any).N;
        [1024, 4096, 16384, 32768, 65536].forEach(n => {
            data.push({
                name: n.toString(),
                time: n / 100,
                isCurrent: n === currentN
            });
        });
    }
    return data;
};

export const CostTimeChart: React.FC<CostTimeChartProps> = ({ algorithm, currentParams }) => {
    // Only show for KDFs that have a tunable cost factor
    const supported = ['bcrypt', 'argon2', 'pbkdf2', 'scrypt'];
    if (!supported.includes(algorithm)) return null;

    const data = getData(algorithm, currentParams);

    return (
        <NeonCard color="purple" className="flex flex-col gap-4">
            <label className="text-neon-purple font-mono text-sm uppercase tracking-wider">Estimated Cost vs Time</label>
            <div className="h-[200px] w-full text-xs font-mono">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                            tick={{ fill: '#94a3b8' }}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            tick={{ fill: '#94a3b8' }}
                            unit="ms"
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#a855f7', color: '#fff' }}
                            cursor={{ stroke: '#a855f7' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="time"
                            stroke="#a855f7"
                            strokeWidth={2}
                            dot={(props: any) => {
                                const { cx, cy, payload } = props;
                                if (payload.isCurrent) {
                                    return <circle cx={cx} cy={cy} r={6} fill="#a855f7" stroke="#fff" strokeWidth={2} />;
                                }
                                return <circle cx={cx} cy={cy} r={3} fill="#a855f7" />;
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 text-center">
                Chart shows theoretical relationship. Highlighted dot is closest to current settings.
            </p>
        </NeonCard>
    );
};
