import Form from "@/components/Form";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
    return (
        <div className="absolute inset-4">
            <h1 className="text-2xl font-bold mb-2">dCrafter</h1>
            <p className="text-gray-800 dark:text-gray-300">The easiest way to mint and deploy NFTs right from your browser.</p>
            <ConnectButton/>
            <Form/>
        </div>
    )
}
