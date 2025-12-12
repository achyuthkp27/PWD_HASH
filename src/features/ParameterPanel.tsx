import React from 'react';
import type { HashingParams, AlgorithmName } from '../lib/hashing/types';
import { NeonCard } from '../components/ui/NeonCard';

interface ParameterPanelProps {
    algorithm: AlgorithmName;
    params: HashingParams;
    onChange: (params: HashingParams) => void;
}

export const ParameterPanel: React.FC<ParameterPanelProps> = ({ algorithm, params, onChange }) => {
    const handleChange = (key: string, value: any) => {
        onChange({ ...params, [key]: value } as HashingParams);
    };

    const renderBcrypt = () => {
        if (params.name !== 'bcrypt') return null;
        return (
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <label className="text-slate-300">Cost Factor (Log Rounds)</label>
                        <span className="text-neon-cyan font-mono">{params.cost} ({Math.pow(2, params.cost).toLocaleString()} iters)</span>
                    </div>
                    <input
                        type="range" min="4" max="16" step="1"
                        value={params.cost}
                        onChange={(e) => handleChange('cost', parseInt(e.target.value))}
                        className="w-full accent-neon-cyan h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-slate-500 mt-1">Recommended: 10-12. Above 12 gets significantly slower.</p>
                </div>
            </div>
        );
    };

    const renderArgon2 = () => {
        if (params.name !== 'argon2') return null;
        return (
            <div className="space-y-4">
                <div>
                    <label className="text-slate-300 text-sm mb-2 block">Variant</label>
                    <div className="flex gap-2">
                        {['argon2id', 'argon2i', 'argon2d'].map(t => (
                            <button
                                key={t}
                                onClick={() => handleChange('type', t)}
                                className={`px-3 py-1 text-xs rounded border ${params.type === t ? 'bg-neon-purple/20 border-neon-purple text-neon-purple' : 'bg-black/20 border-slate-700 text-slate-400'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <label className="text-slate-300">Memory (KiB)</label>
                        <span className="text-neon-purple font-mono">{params.memory} KiB</span>
                    </div>
                    <input
                        type="range" min="1024" max="1048576" step="1024" // Up to 1GB
                        value={params.memory}
                        onChange={(e) => handleChange('memory', parseInt(e.target.value))}
                        className="w-full accent-neon-purple h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <label className="text-slate-300">Iterations (Time)</label>
                        <span className="text-neon-purple font-mono">{params.time}</span>
                    </div>
                    <input
                        type="range" min="1" max="100" step="1"
                        value={params.time}
                        onChange={(e) => handleChange('time', parseInt(e.target.value))}
                        className="w-full accent-neon-purple h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <label className="text-slate-300">Parallelism (Threads)</label>
                        <span className="text-neon-purple font-mono">{params.parallelism}</span>
                    </div>
                    <input
                        type="range" min="1" max="8" step="1"
                        value={params.parallelism}
                        onChange={(e) => handleChange('parallelism', parseInt(e.target.value))}
                        className="w-full accent-neon-purple h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>
        );
    };

    const renderPbkdf2 = () => {
        if (params.name !== 'pbkdf2') return null;
        return (
            <div className="space-y-4">
                <div>
                    <label className="text-slate-300 text-sm mb-2 block">Hash Function</label>
                    <select
                        value={params.hash}
                        onChange={(e) => handleChange('hash', e.target.value)}
                        className="w-full bg-black/40 border border-slate-700 rounded text-sm p-2 text-white font-mono"
                    >
                        <option value="SHA-256">SHA-256</option>
                        <option value="SHA-512">SHA-512</option>
                    </select>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <label className="text-slate-300">Iterations</label>
                        <span className="text-neon-green font-mono">{params.iterations.toLocaleString()}</span>
                    </div>
                    <input
                        type="range" min="1000" max="1000000" step="1000"
                        value={params.iterations}
                        onChange={(e) => handleChange('iterations', parseInt(e.target.value))}
                        className="w-full accent-neon-green h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-slate-500 mt-1">OWASP recommends 600,000+ for PBKDF2-HMAC-SHA256.</p>
                </div>
            </div>
        );
    };

    const renderScrypt = () => {
        if (params.name !== 'scrypt') return null;
        return (
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <label className="text-slate-300">Cost (N) - CPU/Memory</label>
                        <span className="text-yellow-400 font-mono">{params.N}</span>
                    </div>
                    <select
                        value={params.N}
                        onChange={(e) => handleChange('N', parseInt(e.target.value))}
                        className="w-full bg-black/40 border border-slate-700 rounded text-sm p-2 text-white font-mono mb-2"
                    >
                        {[256, 1024, 4096, 16384, 32768, 65536, 131072].map(n => (
                            <option key={n} value={n}>{n} ({Math.log2(n)} loops)</option>
                        ))}
                    </select>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <label className="text-slate-300">Block Size (r)</label>
                        <span className="text-yellow-400 font-mono">{params.r}</span>
                    </div>
                    <input
                        type="range" min="1" max="32" step="1"
                        value={params.r}
                        onChange={(e) => handleChange('r', parseInt(e.target.value))}
                        className="w-full accent-yellow-400 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <label className="text-slate-300">Parallelization (p)</label>
                        <span className="text-yellow-400 font-mono">{params.p}</span>
                    </div>
                    <input
                        type="range" min="1" max="8" step="1"
                        value={params.p}
                        onChange={(e) => handleChange('p', parseInt(e.target.value))}
                        className="w-full accent-yellow-400 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>
        );
    };

    const renderFastHash = () => {
        const fastAlgos = ['md5', 'sha1', 'sha256', 'sha512', 'sha3', 'sha3-128', 'ripemd160'];
        if (!fastAlgos.includes(params.name)) return null;

        // params is FastHashParams here (or has compatible shape)
        const fastParams = params as any; // Cast for simplicity as types.ts ensures they have iterations

        return (
            <div className="space-y-4">
                <div className="p-3 bg-yellow-900/20 border border-yellow-700/30 rounded text-xs text-yellow-200/70">
                    <strong className="text-yellow-500 block mb-1">Warning:</strong>
                    These algorithms are too fast for password storage. Real world attacks can try billions per second.
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <label className="text-slate-300">Salt Length (Bytes)</label>
                        <span className="text-yellow-500 font-mono">{fastParams.saltLength}</span>
                    </div>
                    <input
                        type="range" min="0" max="64" step="1"
                        value={fastParams.saltLength}
                        onChange={(e) => handleChange('saltLength', parseInt(e.target.value))}
                        className="w-full accent-yellow-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-slate-500 mt-1">Set to 0 for unsalted (pure hash).</p>
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <label className="text-slate-300">Iterations (Simulation)</label>
                        <span className="text-yellow-500 font-mono">{fastParams.iterations}</span>
                    </div>
                    <input
                        type="range" min="1" max="1000000" step="1000" // Logarithmic scale might be better but linear is fine for demo
                        value={fastParams.iterations}
                        onChange={(e) => handleChange('iterations', Math.max(1, parseInt(e.target.value)))}
                        className="w-full accent-yellow-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-600 px-1 mt-1">
                        <span>1</span>
                        <span>1M</span>
                    </div>
                </div>
            </div>
        );
    }

    const renderEncryption = () => {
        const encAlgos = ['aes', 'des', 'tripledes', 'blowfish', 'twofish', 'chacha20'];
        if (!encAlgos.includes(params.name)) return null;

        const encParams = params as any;

        return (
            <div className="space-y-4">
                <div>
                    <label className="text-slate-300 text-sm mb-2 block">Secret Key</label>
                    <input
                        type="text"
                        value={encParams.key || ''}
                        onChange={(e) => handleChange('key', e.target.value)}
                        className="w-full bg-black/40 border border-slate-700 rounded p-2 text-sm text-purple-300 font-mono focus:border-purple-500 focus:outline-none"
                        placeholder="Enter encryption passphrase..."
                    />
                </div>

                {params.name !== 'chacha20' && (
                    <div>
                        <label className="text-slate-300 text-sm mb-2 block">Block Mode</label>
                        <select
                            value={encParams.mode || 'CBC'}
                            onChange={(e) => handleChange('mode', e.target.value)}
                            className="w-full bg-black/40 border border-slate-700 rounded text-sm p-2 text-white font-mono"
                        >
                            <option value="CBC">CBC (Cipher Block Chaining)</option>
                            <option value="ECB">ECB (Electronic Codebook) - Insecure</option>
                            <option value="CTR">CTR (Counter)</option>
                            <option value="CFB">CFB (Cipher Feedback)</option>
                            <option value="OFB">OFB (Output Feedback)</option>
                        </select>
                        {encParams.mode === 'ECB' && (
                            <p className="text-xs text-red-400 mt-1">Warning: ECB mode is insecure for highly repetitive data.</p>
                        )}
                    </div>
                )}

                {params.name !== 'chacha20' && encParams.mode !== 'ECB' && (
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <label className="text-slate-300">IV Length</label>
                            <span className="text-purple-400 font-mono">{encParams.ivLength || 16} bytes</span>
                        </div>
                        <input
                            type="range" min="8" max="32" step="8"
                            value={encParams.ivLength || 16}
                            onChange={(e) => handleChange('ivLength', parseInt(e.target.value))}
                            className="w-full accent-purple-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                )}

                {params.name === 'chacha20' && (
                    <div className="p-3 bg-purple-900/20 border border-purple-700/30 rounded text-xs text-purple-200/70">
                        ChaCha20 is a stream cipher. It uses a 96-bit nonce (IV) and a 32-bit counter.
                    </div>
                )}
            </div>
        );
    }

    const getConnectionColor = () => {
        const encAlgos = ['aes', 'des', 'tripledes', 'blowfish', 'twofish', 'chacha20'];
        if (encAlgos.includes(algorithm)) return 'purple';

        switch (algorithm) {
            case 'bcrypt': return 'cyan';
            case 'argon2': return 'purple';
            case 'pbkdf2': return 'green';
            case 'scrypt': return 'yellow';
            default: return 'yellow';
        }
    }

    return (
        <NeonCard color={getConnectionColor()} className="flex flex-col gap-4">
            <label className="text-neon-cyan font-mono text-sm uppercase tracking-wider flex items-center justify-between">
                <span>Configuration</span>
                <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {algorithm.toUpperCase()}
                </span>
            </label>
            {renderBcrypt()}
            {renderArgon2()}
            {renderPbkdf2()}
            {renderScrypt()}
            {renderFastHash()}
            {renderEncryption()}
        </NeonCard>
    );
};
