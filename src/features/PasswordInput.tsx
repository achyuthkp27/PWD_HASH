import React, { useMemo } from 'react';
import zxcvbn from 'zxcvbn';
import { Eye, EyeOff, Wand2, ShieldAlert } from 'lucide-react';
import { NeonCard } from '../components/ui/NeonCard';
import { NeonButton } from '../components/ui/NeonButton';

interface PasswordInputProps {
    value: string;
    onChange: (val: string) => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange }) => {
    const [showPassword, setShowPassword] = React.useState(true); // Default true for playground

    const strength = useMemo(() => {
        if (!value) return null;
        return zxcvbn(value);
    }, [value]);

    const generatePassword = () => {
        // simple generator
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
        let pass = '';
        const len = 16;
        for (let i = 0; i < len; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        onChange(pass);
    };

    const getStrengthColor = (score: number) => {
        if (score < 2) return 'bg-red-500';
        if (score < 3) return 'bg-yellow-500';
        if (score < 4) return 'bg-neon-cyan';
        return 'bg-neon-green';
    };

    const getStrengthLabel = (score: number) => {
        switch (score) {
            case 0: return 'Very Weak';
            case 1: return 'Weak';
            case 2: return 'Fair';
            case 3: return 'Strong';
            case 4: return 'Very Strong';
            default: return '';
        }
    }

    return (
        <NeonCard className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-1">
                <label className="text-neon-cyan font-mono text-sm uppercase tracking-wider">Input / Message</label>
                <div className="flex gap-2">
                    <NeonButton size="sm" variant="ghost" onClick={generatePassword} title="Generate Random">
                        <Wand2 className="w-4 h-4 mr-1" /> Gen
                    </NeonButton>
                </div>
            </div>

            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neon-green font-mono">{`$`}</span>
                </div>
                <input
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-black/50 border border-slate-700 rounded-lg py-3 pl-8 pr-12 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                    placeholder="Enter a password to hash..."
                />
                <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors"
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>

            {/* Strength Meter */}
            {value && strength && (
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                        <span>Strength: <span className="text-white ml-1">{getStrengthLabel(strength.score)}</span></span>
                        <span>Entropy ~{Math.round(strength.guesses_log10 * 3.32)} bits</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${getStrengthColor(strength.score)}`}
                            style={{ width: `${(strength.score + 1) * 20}%` }}
                        />
                    </div>
                    {strength.feedback.warning && (
                        <div className="text-xs text-yellow-500 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> {strength.feedback.warning}
                        </div>
                    )}
                </div>
            )}
        </NeonCard>
    );
};
