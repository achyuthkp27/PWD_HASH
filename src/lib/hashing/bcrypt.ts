import bcrypt from 'bcryptjs';
import type { BcryptParams, HashResult } from './types';

export const hashBcrypt = async (password: string, params: BcryptParams): Promise<HashResult> => {
    const start = performance.now();

    // Bcryptjs hash(s, salt) or hash(s, cost). 
    // If we want to control salt explicitly, we use genSalt, then hash.
    // But bcryptjs genSalt takes cost.

    const salt = await bcrypt.genSalt(params.cost);
    const hash = await bcrypt.hash(password, salt);

    const end = performance.now();

    // Parse breakdown
    // $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
    // [ver] [cost] [salt (22 chars)] [hash (31 chars)]

    const parts = hash.split('$');
    // parts[0] is empty, parts[1] is algo/ver (2a/2b), parts[2] is cost, parts[3] corresponds to salt+hash concatenated (it's actually base64 encoded together)
    // Actually bcrypt string format is: $id$cost$salt+hash
    // The salt is 22 characters. The hash is 31 characters.

    const version = parts[1];
    const cost = parts[2];
    const remainder = parts[3];
    const saltStr = remainder.substring(0, 22);
    const hashStr = remainder.substring(22);

    return {
        hash,
        timeMs: end - start,
        breakdown: [
            { label: 'Alg', value: version, description: 'Bcrypt version identifier', color: 'cyan' },
            { label: 'Cost', value: cost, description: `2^${cost} iterations`, color: 'purple' },
            { label: 'Salt', value: saltStr, description: 'Base64 encoded salt (22 chars)', color: 'yellow' },
            { label: 'Hash', value: hashStr, description: 'Resulting 184-bit hash', color: 'green' }
        ]
    };
};
