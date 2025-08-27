import { TurboAuthenticatedClient, TurboFactory, TurboUploadDataItemResponse } from '@ardrive/turbo-sdk/web';
import { InjectedEthereumSigner } from '@dha-team/arbundles';
import { useEffect, useRef, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

export function useUploadFile() {
    const { address } = useAccount();
    const { signMessageAsync } = useSignMessage();

    const turbo = useRef<TurboAuthenticatedClient>(null);
    
    // const [price, setPrice] = useState('0');
    // const [token, setToken] = useState('');
    const [result, setResult] = useState<TurboUploadDataItemResponse | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

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

        turbo.current = TurboFactory.authenticated({ token: 'pol', signer });
    }, [address, signMessageAsync]);

    function upload(file: File, onFinish?: () => void) {
        if (!turbo.current || loading) return;
        setProgress(0);
        setLoading(true);
        setError('');
        const stream = file.stream(), size = file.size;

        turbo.current.uploadFile({
            fileStreamFactory: () => stream,
            fileSizeFactory: () => size,
            dataItemOpts: {
                tags: [
                    { name: "Content-Type", value: file.type },
                    { name: "App-Name", value: "dCrafter" },
                    { name: "Funded-By", value: "Polygon" },
                ],
            },
            events: {
                onProgress: ({ totalBytes, processedBytes }) => setProgress(Math.round((processedBytes / totalBytes) * 100)),
                onError: (err) => setError(err.message || String(err)),
            },
        }).then(result => {
            setResult(result);
            setLoading(false);
            onFinish?.();
        }).catch(err => {
            setError(err.message || String(err));
        });
    }

    return { result, error, loading, progress, upload }
}