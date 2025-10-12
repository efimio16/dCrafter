import type { Metadata } from "next";
// import { Poppins } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider"
import PlausibleProvider from "next-plausible";

// const poppins = Poppins({
//     weight: ['300', '700'],
//     subsets: ["latin"],
// });

export const metadata: Metadata = {
    title: "dCrafter - NFT creation tool for creators",
    description: "Easily mint and deploy NFTs with dCrafter. Upload your media, deploy contracts, and list on OpenSea in minutes.",
    keywords: [
        "NFT",
        "Web3",
        "dCrafter",
        "mint NFT",
        "deploy NFT contract",
        "NFT marketplace",
        "NFT creator tool",
        "NFT generator",
        "crypto art",
        "blockchain",
        "Arweave",
        "Bundlr",
        "OpenSea",
        "ERC721",
        "ERC1155",
        "Ethereum",
        "Polygon",
        "smart contracts",
        "NFT portfolio",
        "digital art"
    ]
}


export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en" suppressHydrationWarning>
            {/* <body className={`dark:bg-gray-950 text-black dark:text-white p-4 relative`}> */}
            <body style={{ padding: '20px' }}>
                <Provider>
                    <PlausibleProvider
                    domain="dcrafter.vercel.app"
                    trackLocalhost
                    enabled
                >{children}</PlausibleProvider></Provider>
            </body>
        </html>
    );
}
