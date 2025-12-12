import React from 'react';
import type { AlgorithmName } from '../lib/hashing/types';
import { clsx } from 'clsx';
import { NeonCard } from '../components/ui/NeonCard';

interface AlgorithmSelectorProps {
    selected: AlgorithmName;
    onSelect: (name: AlgorithmName) => void;
}

const PASSWORD_ALGOS: { id: AlgorithmName; label: string; desc: string }[] = [
    { id: 'bcrypt', label: 'bcrypt', desc: 'Standard, adaptive.' },
    { id: 'argon2', label: 'Argon2', desc: 'Winner of PHC. Memory-hard.' },
    { id: 'pbkdf2', label: 'PBKDF2', desc: 'NIST recommended. CPU-heavy.' },
    { id: 'scrypt', label: 'scrypt', desc: 'Memory-hard, pre-Argon2.' },
];

const ENCRYPTION_ALGOS: { id: AlgorithmName; label: string; desc: string }[] = [
    { id: 'aes', label: 'AES', desc: 'Standard (128/192/256).' },
    { id: 'chacha20', label: 'ChaCha20', desc: 'Fast stream cipher.' },
    { id: 'twofish', label: 'Twofish', desc: 'Secure, finalist vs AES.' },
    { id: 'blowfish', label: 'Blowfish', desc: 'Legacy, fast.' },
    { id: 'tripledes', label: '3DES', desc: 'Legacy block cipher.' },
    { id: 'des', label: 'DES', desc: 'Insecure, legacy.' },
];

const MESSAGE_DIGEST_ALGOS: { id: AlgorithmName; label: string; desc: string }[] = [
    { id: 'md5', label: 'MD5', desc: 'Broken, very fast.' },
    { id: 'sha1', label: 'SHA-1', desc: 'Broken, legacy.' },
    { id: 'sha256', label: 'SHA-256', desc: 'Standard secure hash.' },
    { id: 'sha512', label: 'SHA-512', desc: 'Secure, 64-bit optimized.' },
    { id: 'sha3', label: 'SHA-3', desc: 'Keccak-based, modern.' },
    { id: 'sha3-128', label: 'SHA-3-128', desc: '128-bit variant.' },
    { id: 'ripemd160', label: 'RIPEMD', desc: '160-bit, Bitcoin used.' },
];

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({ selected, onSelect }) => {
    const renderButtons = (list: typeof PASSWORD_ALGOS) => (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {list.map((algo) => (
                <button
                    key={algo.id}
                    onClick={() => onSelect(algo.id)}
                    className={clsx(
                        "flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 text-sm h-full",
                        selected === algo.id
                            ? "bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                            : "bg-black/40 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                    )}
                >
                    <span className="font-bold text-base mb-1">{algo.label}</span>
                    <span className="text-[10px] opacity-70 text-center leading-tight hidden sm:block">{algo.desc}</span>
                </button>
            ))}
        </div>
    );

    return (
        <NeonCard className="flex flex-col gap-6">
            <div>
                <label className="text-neon-cyan font-mono text-sm uppercase tracking-wider mb-3 block">Password Hashing (KDF)</label>
                {renderButtons(PASSWORD_ALGOS)}
            </div>

            <div>
                <label className="text-purple-400 font-mono text-sm uppercase tracking-wider mb-3 block flex items-center justify-between">
                    <span>Symmetric Encryption</span>
                    <span className="text-[10px] bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded border border-purple-700/50">REQUIRES KEY</span>
                </label>
                {renderButtons(ENCRYPTION_ALGOS)}
            </div>

            <div>
                <label className="text-yellow-500 font-mono text-sm uppercase tracking-wider mb-3 block flex items-center justify-between">
                    <span>General Purpose (Fast)</span>
                    <span className="text-[10px] bg-yellow-900/30 text-yellow-500 px-2 py-0.5 rounded border border-yellow-700/50">NOT FOR PASSWORDS</span>
                </label>
                {renderButtons(MESSAGE_DIGEST_ALGOS)}
            </div>
        </NeonCard>
    );
};
