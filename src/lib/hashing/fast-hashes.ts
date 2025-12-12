import CryptoJS from 'crypto-js';
import type { FastHashParams, HashResult } from './types';

// Helper to run Crypto-JS algo
export const runCryptoJS = (
    password: string,
    params: FastHashParams,
    algoFunc: (message: CryptoJS.lib.WordArray | string) => CryptoJS.lib.WordArray,
    algoName: string,
    color: 'cyan' | 'purple' | 'yellow' | 'green' | 'gray'
): HashResult => {
    const start = performance.now();

    // 1. Generate Salt
    let saltHex = '';
    let saltWord: CryptoJS.lib.WordArray | null = null;

    if (params.saltLength > 0) {
        saltWord = CryptoJS.lib.WordArray.random(params.saltLength);
        saltHex = saltWord.toString(CryptoJS.enc.Hex);
    }

    // 2. Loop
    // Initial: Hash(Password + Salt)
    // Subsequent: Hash(Prev)

    let hashed: CryptoJS.lib.WordArray;

    if (saltWord) {
        const pwWord = CryptoJS.enc.Utf8.parse(password);
        // Concate appends to the first word array and returns it
        const combined = pwWord.concat(saltWord);
        hashed = algoFunc(combined);
    } else {
        hashed = algoFunc(password);
    }

    // Remaining iterations
    const iterations = params.iterations || 1;
    for (let i = 1; i < iterations; i++) {
        hashed = algoFunc(hashed);
    }

    const end = performance.now();
    const resultHex = hashed.toString(CryptoJS.enc.Hex);

    return {
        hash: resultHex,
        timeMs: end - start,
        breakdown: [
            { label: 'Alg', value: algoName, description: 'Message Digest', color },
            { label: 'Iter', value: iterations.toString(), description: 'Loop count', color: 'gray' },
            { label: 'Salt', value: saltHex || 'None', description: saltHex ? 'Random salt' : 'Unsalted', color: 'yellow' },
            { label: 'Hash', value: resultHex.substring(0, 20) + '...', description: 'Result (truncated)', color: 'green' }
        ]
    };
};

export const hashMD5 = (p: string, params: FastHashParams) => runCryptoJS(p, params, CryptoJS.MD5, 'MD5', 'yellow');
export const hashSHA1 = (p: string, params: FastHashParams) => runCryptoJS(p, params, CryptoJS.SHA1, 'SHA-1', 'yellow');
export const hashSHA256 = (p: string, params: FastHashParams) => runCryptoJS(p, params, CryptoJS.SHA256, 'SHA-256', 'cyan');
export const hashSHA512 = (p: string, params: FastHashParams) => runCryptoJS(p, params, CryptoJS.SHA512, 'SHA-512', 'cyan');
export const hashSHA3 = (p: string, params: FastHashParams) => runCryptoJS(p, params, CryptoJS.SHA3, 'SHA-3', 'purple');
export const hashRIPEMD160 = (p: string, params: FastHashParams) => runCryptoJS(p, params, CryptoJS.RIPEMD160, 'RIPEMD-160', 'purple');
