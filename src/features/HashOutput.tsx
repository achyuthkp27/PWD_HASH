import React from 'react';
import type { HashResult } from '../lib/hashing/types';
import { NeonCard } from '../components/ui/NeonCard';
import { NeonButton } from '../components/ui/NeonButton';
import { Copy, CheckCircle, Clock, Zap } from 'lucide-react';

interface HashOutputProps {
    result: HashResult | null;
    className?: string;
}

export const HashOutput: React.FC<HashOutputProps> = ({ result, className }) => {
    const [copied, setCopied] = React.useState(false);

    if (!result) {
        return (
            <NeonCard className={`${className} min-h-[200px] flex items-center justify-center border-dashed border-slate-800 bg-transparent`}>
                <div className="text-slate-600 font-mono text-sm animate-pulse">Waiting for input...</div>
            </NeonCard>
        );
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(result.hash);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Main Result */}
            <NeonCard color="green" className="relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-50 animate-pulse-slow" />
                <div className="flex justify-between items-center mb-4">
                    <label className="text-neon-green font-mono text-xs uppercase tracking-wider">Output Result</label>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                            <Clock className="w-3 h-3" />
                            <span className={result.timeMs > 500 ? 'text-red-400' : 'text-neon-cyan'}>
                                {result.timeMs.toFixed(2)}ms
                            </span>
                        </div>
                        <NeonButton size="sm" variant="ghost" onClick={handleCopy}>
                            {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </NeonButton>
                    </div>
                </div>

                <div className="font-mono text-sm break-all text-slate-300 leading-relaxed p-3 bg-black/40 rounded border border-slate-800/50">
                    {result.hash}
                </div>
            </NeonCard>

            {/* Breakdown */}
            {result.breakdown && (
                <NeonCard color="cyan" noPadding className="overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-white/5">
                        <label className="text-neon-cyan font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                            <Zap className="w-3 h-3" /> Details Breakdown
                        </label>
                    </div>
                    <div className="divide-y divide-white/5">
                        {result.breakdown.map((part, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row p-4 hover:bg-white/5 transition-colors group">
                                <div className="w-24 shrink-0 mb-1 sm:mb-0">
                                    <span className={`text-xs font-bold uppercase py-0.5 px-1.5 rounded bg-${part.color === 'gray' ? 'slate' : 'neon-' + part.color}/10 text-${part.color === 'gray' ? 'slate-400' : 'neon-' + part.color}`}>
                                        {part.label}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-mono text-white truncate group-hover:whitespace-normal group-hover:break-all transition-all" title={part.value}>
                                        {part.value}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">{part.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </NeonCard>
            )}
        </div>
    );
};
