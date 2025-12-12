// Basic Worker Skeleton
import type { WorkerRequest, WorkerResponse } from './types';
import { hashBcrypt } from './bcrypt';
import { hashArgon2 } from './argon2';
import { hashPbkdf2 } from './pbkdf2';
import { hashScrypt } from './scrypt';
import { hashMD5, hashSHA1, hashSHA256, hashSHA512, hashSHA3, hashRIPEMD160 } from './fast-hashes';
import { encryptAES, encryptDES, encryptTripleDES, encryptBlowfish, encryptTwofish, encryptChaCha20, hashSHA3_128 } from './encryption';

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
    const { id, password, params } = e.data;


    try {
        let result;

        switch (params.name) {
            case 'bcrypt':
                result = await hashBcrypt(password, params);
                break;
            case 'argon2':
                result = await hashArgon2(password, params);
                break;
            case 'pbkdf2':
                result = await hashPbkdf2(password, params);
                break;
            case 'scrypt':
                result = await hashScrypt(password, params);
                break;
            case 'md5':
                result = hashMD5(password, params);
                break;
            case 'sha1':
                result = hashSHA1(password, params);
                break;
            case 'sha256':
                result = hashSHA256(password, params);
                break;
            case 'sha512':
                result = hashSHA512(password, params);
                break;
            case 'sha3':
                result = hashSHA3(password, params);
                break;
            case 'sha3-128':
                result = hashSHA3_128(password, params);
                break;
            case 'ripemd160':
                result = hashRIPEMD160(password, params);
                break;
            case 'aes':
                result = encryptAES(password, params);
                break;
            case 'des':
                result = encryptDES(password, params);
                break;
            case 'tripledes':
                result = encryptTripleDES(password, params);
                break;
            case 'blowfish':
                result = await encryptBlowfish(password, params);
                break;
            case 'twofish':
                result = encryptTwofish(password, params);
                break;
            case 'chacha20':
                result = encryptChaCha20(password, params);
                break;
            default:
                throw new Error(`Unknown algorithm: ${(params as any).name}`);
        }

        self.postMessage({ id, result } as WorkerResponse);
    } catch (error: any) {
        self.postMessage({ id, error: error.message || String(error) } as WorkerResponse);
    }
};
