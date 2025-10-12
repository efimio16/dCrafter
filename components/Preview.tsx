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
    fileName: string;
}

const videoAudioExtensions = ['webm', 'mp4', 'm4v', 'ogv', 'ogg', 'oga', 'mp3', 'wav'];
const modelExtensions = ['gltf', 'glb'];
const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

export default function Preview({ src, fileName }: PreviewProps) {
    const fileExt = fileName.split('.').at(-1) || '';
    return (
        imageExtensions.includes(fileExt) ? <Image src={src} width={200} height={200} className="size-full" alt="preview"/> :
        videoAudioExtensions.includes(fileExt) ? <ReactPlayer src={src} className="size-full" controls/> :
        modelExtensions.includes(fileExt) ? (
            <Canvas className="size-full">
                <ambientLight intensity={2}/>
                <Model url={src} />
                <OrbitControls />
            </Canvas>
        ) : <p>Unknown file type</p>
    )
}