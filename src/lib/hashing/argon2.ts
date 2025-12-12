import type { Argon2Params, HashResult } from './types';

export const hashArgon2 = async (password: string, params: Argon2Params): Promise<HashResult> => {
    const start = performance.now();

    const salt = crypto.getRandomValues(new Uint8Array(params.saltLength));

    // Dynamic import to prevent worker crash
    let argon2: any;
    try {
        const module = await import('argon2-browser');
        // Try various export locations
        argon2 = module.default || module;

        // Fallback: Check global scope (self) because UMD might attach there
        if ((!argon2 || !argon2.hash) && typeof self !== 'undefined' && (self as any).argon2) {
            argon2 = (self as any).argon2;
        }

    } catch (e: any) {
        console.error("Argon2 Import Error:", e);
        throw new Error(`Failed to load Argon2 module: ${e.message}`);
    }

    if (!argon2 || !argon2.hash) {
        console.error("Argon2 Loaded Object:", argon2);
        throw new Error('Argon2 module loaded but hash function not found. Check console for details.');
    }

    const result = await argon2.hash({
        pass: password,
        salt: salt,
        time: params.time,
        mem: params.memory, // argon2-browser expects KiB
        hashLen: params.hashLength,
        parallelism: params.parallelism,
        type: params.type === 'argon2id' ? argon2.ArgonType.Argon2id :
            params.type === 'argon2i' ? argon2.ArgonType.Argon2i :
                argon2.ArgonType.Argon2d,
        distPath: typeof self !== 'undefined' ? new URL('/', self.location.href).toString() : undefined
    });

    const end = performance.now();

    // result.encoded corresponds to the standard argon2 string
    // $argon2id$v=19$m=65536,t=3,p=4$salt$hash

    // Parse breakdown
    // Example: $argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$iVd...
    const parts = result.encoded.split('$');
    // parts[1] = algo (argon2id)
    // parts[2] = version (v=19)
    // parts[3] = params (m=,t=,p=)
    // parts[4] = salt (base64)
    // parts[5] = hash (base64)

    return {
        hash: result.encoded,
        timeMs: end - start,
        breakdown: [
            { label: 'Alg', value: parts[1], description: 'Argon2 variant', color: 'cyan' },
            { label: 'Ver', value: parts[2], description: 'Version 19 (0x13)', color: 'gray' },
            { label: 'Params', value: parts[3], description: 'Memory, Time, Parallelism', color: 'purple' },
            { label: 'Salt', value: parts[4], description: 'Base64 encoded salt', color: 'yellow' },
            { label: 'Hash', value: parts[5], description: 'Compute result', color: 'green' }
        ]
    };
};
