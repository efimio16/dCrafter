import { useState } from "react";
import { waitForTransactionReceipt } from "viem/actions";
import { useWalletClient } from "wagmi";

export interface ContractOptions {
    name: string;
    symbol: string;
    baseURI: string;
    royaltyReceiver: string;
    royaltyFee: number;
    supply: number;
}


export function useGenerateContract() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { data: walletClient } = useWalletClient();
    const [hash, setHash] = useState('');
    const [status, setStatus] = useState<'compiling' | 'deploying' | 'confirming' | 'fulfilled'>('fulfilled');

    async function generateContract(options: ContractOptions, onComplete?: (address: `0x${string}`) => void) {
        if (loading || !walletClient) return;
        setLoading(true);
        setError('');
        setHash('');
        try {
            setStatus('compiling');
            const result = await fetch('/api/createContract', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(options),
            });

            const json = await result.json();
            if (!result.ok) throw new Error(typeof json.error === 'string' ? json.error : JSON.stringify(json.error));

            setStatus('deploying');
            const { abi, bytecode } = json;
            const hash = await walletClient.deployContract({
                abi,
                bytecode,
                args: []
            });
            setHash(hash);

            setStatus('confirming');
            const receipt = await waitForTransactionReceipt(walletClient, { hash });
            
            setStatus('fulfilled');
            onComplete?.(receipt.contractAddress!);
            return receipt.contractAddress!;
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    }

    return { generateContract, error, loading, hash, status }
}