export type AlgorithmName =
    | 'bcrypt' | 'argon2' | 'pbkdf2' | 'scrypt'
    | 'md5' | 'sha1' | 'sha256' | 'sha512' | 'sha3' | 'ripemd160'
    | 'aes' | 'des' | 'tripledes' | 'blowfish' | 'twofish' | 'chacha20' | 'sha3-128';

export interface BaseParams {
    saltLength: number; // in bytes
}

export interface EncryptionParams extends BaseParams {
    key: string; // The secret key
    mode?: 'ECB' | 'CBC' | 'CTR' | 'OFB' | 'CFB'; // Block modes (not for stream ciphers like ChaCha)
    ivLength?: number; // Request auto-gen IV length
}

export interface FastHashParams extends BaseParams {
    iterations: number; // to demonstrate speed vs KDF
}

export interface BcryptParams extends BaseParams {
    cost: number; // 4-31
}

export interface Argon2Params extends BaseParams {
    time: number; // iterations
    memory: number; // KiB
    parallelism: number; // threads
    hashLength: number;
    type: 'argon2id' | 'argon2i' | 'argon2d';
}

export interface PBKDF2Params extends BaseParams {
    iterations: number;
    hash: 'SHA-256' | 'SHA-512';
}

export interface ScryptParams extends BaseParams {
    N: number; // CPU/memory cost, must be power of 2
    r: number; // block size
    p: number; // parallelization
    dkLen: number; // derived key length
}

export type HashingParams =
    | ({ name: 'bcrypt' } & BcryptParams)
    | ({ name: 'argon2' } & Argon2Params)
    | ({ name: 'pbkdf2' } & PBKDF2Params)
    | ({ name: 'scrypt' } & ScryptParams)
    | ({ name: 'md5' } & FastHashParams)
    | ({ name: 'sha1' } & FastHashParams)
    | ({ name: 'sha256' } & FastHashParams)
    | ({ name: 'sha512' } & FastHashParams)
    | ({ name: 'sha3' } & FastHashParams)
    | ({ name: 'ripemd160' } & FastHashParams)
    | ({ name: 'sha3-128' } & FastHashParams)
    | ({ name: 'aes' } & EncryptionParams)
    | ({ name: 'des' } & EncryptionParams)
    | ({ name: 'tripledes' } & EncryptionParams)
    | ({ name: 'blowfish' } & EncryptionParams)
    | ({ name: 'twofish' } & EncryptionParams)
    | ({ name: 'chacha20' } & EncryptionParams);

export interface HashResult {
    hash: string;
    timeMs: number;
    breakdown?: HashComponent[];
}

export interface HashComponent {
    label: string;
    value: string;
    description: string;
    color: 'cyan' | 'purple' | 'yellow' | 'green' | 'gray';
}

/* Worker Messages */
export interface WorkerRequest {
    id: string;
    password: string;
    params: HashingParams;
}

export interface WorkerResponse {
    id: string;
    result?: HashResult;
    error?: string;
}
