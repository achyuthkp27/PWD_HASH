import type { HashingParams } from './types';

export const DEFAULT_BCRYPT: HashingParams = {
    name: 'bcrypt',
    cost: 12,
    saltLength: 16
};

export const DEFAULT_ARGON2: HashingParams = {
    name: 'argon2',
    type: 'argon2id',
    time: 3,
    memory: 65536, // 64 MB
    parallelism: 4,
    hashLength: 32,
    saltLength: 16
};

export const DEFAULT_PBKDF2: HashingParams = {
    name: 'pbkdf2',
    hash: 'SHA-256',
    iterations: 100000,
    saltLength: 16
};

export const DEFAULT_SCRYPT: HashingParams = {
    name: 'scrypt',
    N: 16384, // 2^14
    r: 8,
    p: 1,
    dkLen: 64, // 64 bytes
    saltLength: 16
};

// Fast Hashes
export const DEFAULT_MD5: HashingParams = { name: 'md5', iterations: 1, saltLength: 0 };
export const DEFAULT_SHA1: HashingParams = { name: 'sha1', iterations: 1, saltLength: 0 };
export const DEFAULT_SHA256: HashingParams = { name: 'sha256', iterations: 1, saltLength: 0 };
export const DEFAULT_SHA512: HashingParams = { name: 'sha512', iterations: 1, saltLength: 0 };
export const DEFAULT_SHA3: HashingParams = { name: 'sha3', iterations: 1, saltLength: 0 };
export const DEFAULT_SHA3_128: HashingParams = { name: 'sha3-128', iterations: 1, saltLength: 0 };
export const DEFAULT_RIPEMD160: HashingParams = { name: 'ripemd160', iterations: 1, saltLength: 0 };

// Encryption
export const DEFAULT_AES: HashingParams = { name: 'aes', key: 'secret_key', mode: 'CBC', saltLength: 0, ivLength: 16 };
export const DEFAULT_DES: HashingParams = { name: 'des', key: 'secret_key', mode: 'CBC', saltLength: 0, ivLength: 8 };
export const DEFAULT_TRIPLEDES: HashingParams = { name: 'tripledes', key: 'secret_key', mode: 'CBC', saltLength: 0, ivLength: 8 };
export const DEFAULT_BLOWFISH: HashingParams = { name: 'blowfish', key: 'secret', mode: 'ECB', saltLength: 0, ivLength: 8 };
export const DEFAULT_TWOFISH: HashingParams = { name: 'twofish', key: 'secret', mode: 'ECB', saltLength: 0, ivLength: 16 };
export const DEFAULT_CHACHA20: HashingParams = { name: 'chacha20', key: 'secret_key_32_bytes_needed', saltLength: 0, ivLength: 12 };

export const DEFAULTS: Record<string, HashingParams> = {
    bcrypt: DEFAULT_BCRYPT,
    argon2: DEFAULT_ARGON2,
    pbkdf2: DEFAULT_PBKDF2,
    scrypt: DEFAULT_SCRYPT,
    md5: DEFAULT_MD5,
    sha1: DEFAULT_SHA1,
    sha256: DEFAULT_SHA256,
    sha512: DEFAULT_SHA512,
    sha3: DEFAULT_SHA3,
    'sha3-128': DEFAULT_SHA3_128,
    ripemd160: DEFAULT_RIPEMD160,
    aes: DEFAULT_AES,
    des: DEFAULT_DES,
    tripledes: DEFAULT_TRIPLEDES,
    blowfish: DEFAULT_BLOWFISH,
    twofish: DEFAULT_TWOFISH,
    chacha20: DEFAULT_CHACHA20
};
