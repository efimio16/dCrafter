import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const poppins = Poppins({
    weight: ['300', '700'],
    subsets: ["latin"],
});

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


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${poppins.className} dark:bg-gray-950 text-black dark:text-white p-4 relative`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
