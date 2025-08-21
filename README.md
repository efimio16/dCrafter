# dCrafter
**Mint and manage NFTs easily**
The easiest way to mint and deploy NFTs right from your browser.

## 🚀 What is dCrafter?
dCrafter is an open-source Web3 utility for creators that allows you to:
- ✅ Connect your crypto wallet (via RainbowKit + wagmi)
- ✅ Upload media files (images, video, audio)
- ✅ Automatically generate `metadata.json`
- ✅ Store media and metadata on **Arweave** via Bundlr Network
- ✅ Deploy an ERC-721/ERC-1155 smart contract
- ✅ List NFTs on **OpenSea** and get a ready-to-share link

## ⚡ MVP Flow
1. User connects their wallet
2. Uploads a file + sets name and description
3. dCrafter generates metadata and uploads it to Arweave
4. Smart contract is generated and deployed to the blockchain
5. NFT is automatically listed on OpenSea
6. User gets a ready-to-share OpenSea link

## 🛠 Tech Stack
- **Frontend:** Next.js, React, TailwindCSS
- **Web3:** RainbowKit, wagmi, ethers.js
- **Storage:** Bundlr + Arweave
- **Contracts:** Solidity, Hardhat, solc
- **Marketplace:** OpenSea SDK

## 💸 Monetization
- Free to use for all creators
- Small transaction fee (~1%) for free users
- Premium subscription → **0% fees**
