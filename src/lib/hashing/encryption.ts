// @ts-ignore
import { Blowfish } from 'egoroof-blowfish';
// @ts-ignore
import { makeSession, encrypt as twofishEncrypt } from 'twofish-ts';
// @ts-ignore
import { Chacha20 } from 'ts-chacha20';

import { runCryptoJS } from './fast-hashes';
import type { EncryptionParams, HashResult, FastHashParams } from './types';
import CryptoJS from 'crypto-js';

// --- Encryption Helpers ---

const stringToUint8Array = (str: string): Uint8Array => {
    return new TextEncoder().encode(str);
};

const uint8ArrayToHex = (arr: Uint8Array): string => {
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
};

// --- Algorithms ---

export const encryptAES = (message: string, params: EncryptionParams): HashResult => {
    const start = performance.now();

    // CryptoJS uses WordArrays.
    // If mode is provided, we use it. Default CBC.
    const mode = params.mode === 'ECB' ? CryptoJS.mode.ECB :
        params.mode === 'CTR' ? CryptoJS.mode.CTR :
            params.mode === 'OFB' ? CryptoJS.mode.OFB :
                params.mode === 'CFB' ? CryptoJS.mode.CFB : CryptoJS.mode.CBC;

    const iv = params.ivLength ? CryptoJS.lib.WordArray.random(params.ivLength) : CryptoJS.lib.WordArray.random(16);

    const encrypted = CryptoJS.AES.encrypt(message, params.key, {
        mode: mode,
        iv: mode === CryptoJS.mode.ECB ? undefined : iv,
        padding: CryptoJS.pad.Pkcs7
    });

    const end = performance.now();

    return {
        hash: encrypted.toString(), // Returns Base64 formatted ciphertext
        timeMs: end - start,
        breakdown: [
            { label: 'Alg', value: 'AES', description: `Advanced Encryption Standard (${params.mode || 'CBC'})`, color: 'cyan' },
            { label: 'Key', value: '***', description: 'Passphrase Used', color: 'gray' },
            { label: 'IV', value: mode === CryptoJS.mode.ECB ? 'N/A' : iv.toString(CryptoJS.enc.Hex), description: 'Initialization Vector', color: 'yellow' },
            { label: 'Out', value: encrypted.ciphertext.toString(CryptoJS.enc.Hex).substring(0, 20) + '...', description: 'Ciphertext (Hex truncated)', color: 'green' }
        ]
    };
};

export const encryptDES = (message: string, params: EncryptionParams): HashResult => {
    const start = performance.now();
    const mode = params.mode === 'ECB' ? CryptoJS.mode.ECB : CryptoJS.mode.CBC;
    const iv = CryptoJS.lib.WordArray.random(8); // DES uses 64-bit blocks

    const encrypted = CryptoJS.DES.encrypt(message, params.key, {
        mode: mode,
        iv: mode === CryptoJS.mode.ECB ? undefined : iv
    });

    const end = performance.now();

    return {
        hash: encrypted.toString(),
        timeMs: end - start,
        breakdown: [
            { label: 'Alg', value: 'DES', description: 'Data Encryption Standard (Legacy)', color: 'cyan' },
            { label: 'Mode', value: params.mode || 'CBC', description: 'Block Cipher Mode', color: 'purple' },
            { label: 'Out', value: encrypted.ciphertext.toString(CryptoJS.enc.Hex).substring(0, 20) + '...', description: 'Ciphertext', color: 'green' }
        ]
    };
};

export const encryptTripleDES = (message: string, params: EncryptionParams): HashResult => {
    const start = performance.now();
    const mode = params.mode === 'ECB' ? CryptoJS.mode.ECB : CryptoJS.mode.CBC;
    const iv = CryptoJS.lib.WordArray.random(8);

    const encrypted = CryptoJS.TripleDES.encrypt(message, params.key, {
        mode: mode,
        iv: mode === CryptoJS.mode.ECB ? undefined : iv
    });

    const end = performance.now();

    return {
        hash: encrypted.toString(),
        timeMs: end - start,
        breakdown: [
            { label: 'Alg', value: '3DES', description: 'Triple DES', color: 'cyan' },
            { label: 'Mode', value: params.mode || 'CBC', description: 'Block Cipher Mode', color: 'purple' },
            { label: 'Out', value: encrypted.ciphertext.toString(CryptoJS.enc.Hex).substring(0, 20) + '...', description: 'Ciphertext', color: 'green' }
        ]
    };
};

export const encryptBlowfish = async (message: string, params: EncryptionParams): Promise<HashResult> => {
    const start = performance.now();

    const mode = params.mode === 'CBC' ? Blowfish.MODE.CBC : Blowfish.MODE.ECB;
    const bf = new Blowfish(params.key, mode, Blowfish.PADDING.PKCS5);

    const iv = new Uint8Array(8);
    crypto.getRandomValues(iv); // 8 bytes for Blowfish
    if (mode === Blowfish.MODE.CBC) {
        bf.setIv(iv);
    }

    const encoded = bf.encode(message); // Returns Uint8Array
    const end = performance.now();

    const hex = uint8ArrayToHex(encoded);
    const ivHex = uint8ArrayToHex(iv);

    return {
        hash: hex,
        timeMs: end - start,
        breakdown: [
            { label: 'Alg', value: 'Blowfish', description: 'Symmetric Block Cipher', color: 'cyan' },
            { label: 'Mode', value: params.mode || 'ECB', description: 'Encryption Mode', color: 'purple' },
            { label: 'IV', value: mode === Blowfish.MODE.CBC ? ivHex : 'N/A', description: 'Initialization Vector', color: 'yellow' },
            { label: 'Out', value: hex.substring(0, 20) + '...', description: 'Ciphertext (Hex)', color: 'green' }
        ]
    };
};

// Helper to avoid name collision in implementation
const encryptTwofishBlock = (plain: Uint8Array, io: number, cipher: Uint8Array, oo: number, session: any) => {
    twofishEncrypt(plain, io, cipher, oo, session);
}

export const encryptTwofish = (message: string, params: EncryptionParams): HashResult => {
    const start = performance.now();

    const keyBytes = new Uint8Array(16);
    const userKey = stringToUint8Array(params.key);
    keyBytes.set(userKey.slice(0, 16));

    const session = makeSession(keyBytes);

    // ECB Manual Padding & Encrypt
    const textBytes = stringToUint8Array(message);
    const paddedLength = Math.ceil((textBytes.length + 1) / 16) * 16;
    const paddedText = new Uint8Array(paddedLength);
    paddedText.set(textBytes);
    // Zero-Pad rest is automatic by allocation

    const blocks = paddedLength / 16;
    const output = new Uint8Array(paddedLength);

    for (let i = 0; i < blocks; i++) {
        // twofish-ts encrypt signature: encrypt(plain, io, cipher, oo, session)
        // io: input offset, oo: output offset
        encryptTwofishBlock(paddedText, i * 16, output, i * 16, session);
    }

    const end = performance.now();
    const hex = uint8ArrayToHex(output);

    return {
        hash: hex,
        timeMs: end - start,
        breakdown: [
            { label: 'Alg', value: 'Twofish', description: 'Successor to Blowfish', color: 'cyan' },
            { label: 'Mode', value: 'ECB (Simulated)', description: 'Manual block loop', color: 'purple' },
            { label: 'Key', value: '128-bit', description: 'Using first 16 bytes', color: 'gray' }
        ]
    };
};

export const encryptChaCha20 = (message: string, params: EncryptionParams): HashResult => {
    const start = performance.now();

    // ChaCha20(key, nonce, counter, message)
    // Key: 32 bytes (256 bits)
    // Nonce: 12 bytes (96 bits)

    const keyBytes = new Uint8Array(32);
    const userKey = stringToUint8Array(params.key);
    keyBytes.set(userKey.slice(0, 32)); // Pad/Truncate

    const nonce = new Uint8Array(12);
    crypto.getRandomValues(nonce);

    const messageBytes = stringToUint8Array(message);

    const chacha = new Chacha20(keyBytes, nonce);
    const encrypted = chacha.encrypt(messageBytes);

    const end = performance.now();

    const hex = uint8ArrayToHex(encrypted);
    const nonceHex = uint8ArrayToHex(nonce);

    return {
        hash: hex,
        timeMs: end - start,
        breakdown: [
            { label: 'Alg', value: 'ChaCha20', description: 'Stream Cipher', color: 'cyan' },
            { label: 'Nonce', value: nonceHex, description: 'Random 96-bit nonce', color: 'yellow' },
            { label: 'Out', value: hex.substring(0, 20) + '...', description: 'Ciphertext', color: 'green' }
        ]
    };
};

export const hashSHA3_128 = (p: string, params: FastHashParams) => {
    const func = (msg: any) => CryptoJS.SHA3(msg, { outputLength: 128 });
    return runCryptoJS(p, params, func, 'SHA-3-128', 'purple');
};
