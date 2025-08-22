'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider } from 'wagmi'
import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { polygon } from '@reown/appkit/networks'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) throw new Error('Project ID is not defined');

const networks = [polygon];

const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage
    }),
    ssr: true,
    projectId,
    networks
});

const queryClient = new QueryClient()

createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [polygon],
    defaultNetwork: polygon,
    metadata: {
        name: 'dCrafted',
        description: 'NFT Generator',
        url: 'http://dcarfter.io',
        icons: [],
    },
    features: {
        analytics: false,
        socials: false,
        email: false,
    },
    enableCoinbase: false,
})

export default function Providers({ children, cookies }: { children: ReactNode; cookies: string | null }) {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies)

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}