'use client';
import { TurboAuthenticatedClient, TurboFactory } from '@ardrive/turbo-sdk/web';
import { InjectedEthereumSigner } from '@dha-team/arbundles';
import { useEffect, useRef, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

export function useTurbo() {
    const { address } = useAccount();
    const { signMessageAsync } = useSignMessage();

    const turbo = useRef<TurboAuthenticatedClient>(null);
    const file = useRef<File>(null);

    const [price, setPrice] = useState('0');
    const [token, setToken] = useState('');
    
    useEffect(() => {
        if (!address || turbo.current) return;

        const signer = new InjectedEthereumSigner({
            getSigner: () => ({
                signMessage(message: string | Uint8Array) {
                    const messageToSign = typeof message == 'string'
                        ? message :
                        { raw: message }
                    return signMessageAsync({ message: messageToSign });
                },
            })
        });

        turbo.current = TurboFactory.authenticated({ token: 'ethereum', signer });
    }, [address]);
    async function handleUpload() {
        if (!turbo.current || !file.current) return;

        const result = await turbo.current.uploadFile({
            fileStreamFactory: () => file.current!.stream(),
            fileSizeFactory: () => file.current!.size,
            dataItemOpts: {
                tags: [
                    { name: "Content-Type", value: file.current.type },
                    { name: "App-Name", value: "My-Next-App" },
                    { name: "Funded-By", value: "Polygon" },
                ],
            },
            events: {
                onProgress: ({ totalBytes, processedBytes, step }) => {
                    console.log(
                    `${step}: ${Math.round((processedBytes / totalBytes) * 100)}%`
                    );
                },
                onError: (err) => {
                    console.log(`Error:`, err);
                },
            },
        });

        console.log(result);
    }

    return (<div>
        <p>Address: {address || 'none'}</p>
        <input type='file' onChange={e => {
            file.current = e.currentTarget.files?.[0] || null;
            (async () => {
                if (!turbo.current) return;
                const tokenPrice = await turbo.current.getTokenPriceForBytes({ byteCount: file.current?.size || 0 });
                setPrice(tokenPrice.tokenPrice);
                setToken(tokenPrice.token);
            })();
        }}/>
        <button onClick={() => handleUpload()}>Upload</button>
        <p>You'll pay {price} {token}</p>
    </div>)
}