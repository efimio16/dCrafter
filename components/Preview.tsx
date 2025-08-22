import Image from "next/image";
import ReactPlayer from "react-player";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}

interface PreviewProps {
    src: string;
    type: 'audio' | 'video' | 'image' | 'model';
}

export default function Preview({ src, type }: PreviewProps) {
    return (
        type == 'image' ? <Image src={src} width={200} height={200} className="size-full" alt="preview"/> :
        type == 'video' || type == 'audio' ? <ReactPlayer src={src} className="size-full" controls/> :
        type == 'model' ? (
            <Canvas className="size-full">
                <ambientLight intensity={2}/>
                <Model url={src} />
                <OrbitControls />
            </Canvas>
        ) : null
    )
}