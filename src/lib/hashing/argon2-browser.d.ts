declare module 'argon2-browser' {
    export interface Argon2HashOptions {
        pass: string;
        salt: Uint8Array | string;
        time?: number;
        mem?: number;
        hashLen?: number;
        parallelism?: number;
        type?: number;
        distPath?: string;
    }

    export interface Argon2Result {
        encoded: string;
        hash: Uint8Array;
        hashHex: string;
    }

    export enum ArgonType {
        Argon2d = 0,
        Argon2i = 1,
        Argon2id = 2,
    }

    export function hash(options: Argon2HashOptions): Promise<Argon2Result>;
}
