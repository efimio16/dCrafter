'use client';
import { useGenerateContract } from "@/lib/useGenerateContract";
import { useAccount } from "wagmi";

export default function Contract() {
    const { address } = useAccount();
    const { loading, error, generateContract } = useGenerateContract();
    
    return loading ? <p>Loading...</p> :
        error ? <p>Error: {error}</p> :
        <p><appkit-button/> <button onClick={() => {
            if (!address) return;
            generateContract({
                name: 'My NFT',
                symbol: 'MNFT',
                baseURI: 'https://example.com',
                royaltyReceiver: address,
                royaltyFee: 10,
                supply: 10,
            });
        }}>Create contract</button></p>
}