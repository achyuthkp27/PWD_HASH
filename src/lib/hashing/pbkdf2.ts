import type { PBKDF2Params, HashResult } from './types';

export const hashPbkdf2 = async (password: string, params: PBKDF2Params): Promise<HashResult> => {
    const start = performance.now();

    const enc = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );

    // Generate a random salt if one isn't provided (conceptually we handle explicit salt later, 
    // but for now let's just generate one to match the 'playground' feel or use a fixed one if we had inputs)
    // For the worker, we might want to pass the salt in parameter.
    // BUT the types say 'saltLength'. So we generate it.

    const salt = crypto.getRandomValues(new Uint8Array(params.saltLength));

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: params.iterations,
            hash: params.hash
        },
        passwordKey,
        256 // 256 bits (32 bytes) is standard for SHA256 usually, or 512 for SHA512
    );

    const hashBuffer = new Uint8Array(derivedBits);
    const hashHex = Array.from(hashBuffer).map(b => b.toString(16).padStart(2, '0')).join('');
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');

    const end = performance.now();

    // Python-style format for display often used: pbkdf2_sha256$iterations$salt$hash
    const formatted = `pbkdf2_${params.hash.toLowerCase().replace('-', '')}$${params.iterations}$${saltHex}$${hashHex}`;

    return {
        hash: formatted,
        timeMs: end - start,
        breakdown: [
            { label: 'Alg', value: `PBKDF2-${params.hash}`, description: 'Algorithm & HMAC', color: 'cyan' },
            { label: 'Iter', value: params.iterations.toString(), description: 'Iteration count', color: 'purple' },
            { label: 'Salt', value: saltHex, description: 'Hex encoded salt', color: 'yellow' },
            { label: 'Hash', value: hashHex, description: 'Derived key content', color: 'green' }
        ]
    };
};
