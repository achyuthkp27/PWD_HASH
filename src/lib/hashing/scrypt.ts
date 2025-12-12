import { scrypt } from 'scrypt-js';
import type { ScryptParams, HashResult } from './types';

export const hashScrypt = async (password: string, params: ScryptParams): Promise<HashResult> => {
    const start = performance.now();

    const enc = new TextEncoder();
    const passwordBuffer = enc.encode(password);
    const salt = crypto.getRandomValues(new Uint8Array(params.saltLength));

    // scrypt-js returns a Promise<Uint8Array>
    // scrypt(password, salt, N, r, p, dkLen)
    const keyWrapper = await scrypt(
        passwordBuffer,
        salt,
        params.N,
        params.r,
        params.p,
        params.dkLen
    );

    const end = performance.now();

    const hashHex = Array.from(keyWrapper).map(b => b.toString(16).padStart(2, '0')).join('');
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');

    // Format is usually scrypt$N$r$p$salt$hash or similar, but standard is closer to a complex string.
    // We'll use a readable format for the playground.
    const formatted = `scrypt$N=${params.N},r=${params.r},p=${params.p}$${saltHex}$${hashHex}`;

    return {
        hash: formatted,
        timeMs: end - start,
        breakdown: [
            { label: 'Alg', value: 'scrypt', description: 'Scrypt algorithm', color: 'cyan' },
            { label: 'Params', value: `N=${params.N},r=${params.r},p=${params.p}`, description: 'Cost parameters', color: 'purple' },
            { label: 'Salt', value: saltHex, description: 'Hex encoded salt', color: 'yellow' },
            { label: 'Hash', value: hashHex, description: 'Derived key', color: 'green' }
        ]
    };
};
