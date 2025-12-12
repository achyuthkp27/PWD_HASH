import { useState, useEffect, useRef, useCallback } from 'react';
import type { HashingParams, HashResult, WorkerRequest, WorkerResponse } from '../lib/hashing/types';

export const useHasher = () => {
    const [isHashing, setIsHashing] = useState(false);
    const [result, setResult] = useState<HashResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lastTime, setLastTime] = useState<number>(0);

    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        // Initialize worker
        const worker = new Worker(new URL('../lib/hashing/worker.ts', import.meta.url), {
            type: 'module'
        });

        worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
            const { result, error } = e.data;
            setIsHashing(false);
            if (error) {
                setError(error);
                setResult(null);
            } else if (result) {
                setResult(result);
                setError(null);
                setLastTime(result.timeMs);
            }
        };

        worker.onerror = (e) => {
            console.error("Worker Error:", e);
            setIsHashing(false);
            setError(`Worker Error: ${e.message}`);
        };

        workerRef.current = worker;

        return () => {
            worker.terminate();
        };
    }, []);

    const hashString = useCallback((password: string, params: HashingParams) => {
        if (!workerRef.current) return;

        setIsHashing(true);
        setError(null);

        const req: WorkerRequest = {
            id: crypto.randomUUID(),
            password,
            params
        };

        workerRef.current.postMessage(req);
    }, []);

    const reset = useCallback(() => {
        setResult(null);
        setError(null);
    }, []);

    return {
        hashString,
        reset,
        isHashing,
        result,
        error,
        lastTime
    };
};
