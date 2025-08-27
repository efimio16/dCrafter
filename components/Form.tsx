'use client';

import { Fieldset, Legend, Button } from "@headlessui/react"
import { FormEvent, useState } from "react"
import Image from "next/image";
import Preview from "./Preview";
import FileSection from "./FilePicker";
import { useUploadFile } from "@/lib/useUploadFile";
import FormField, { FormFieldProps } from "./FormField";

interface NFTMetadata {
    name: string;
    description: string;
    supply: number;
    royaltyFee?: number;
    royaltyReceiver?: string;
    externalUrl?: string;
}

const videoExtensions = ['webm', 'mp4', 'm4v', 'ogv'];
const audioExtensions = ['ogg', 'oga', 'mp3', 'wav'];
const modelExtensions = ['gltf', 'glb'];
const animationExtensions = [...videoExtensions, ...audioExtensions, ...modelExtensions];
const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

export default function Form() {
    const [metadata, setMetadata] = useState<NFTMetadata>({
        name: '',
        description: '',
        supply: 1,
        royaltyFee: 0,
        externalUrl: '',
    });

    const [fileSrc, setFileSrc] = useState<string | null>('');
    const [fileType, setFileType] = useState<'audio' | 'video' | 'image' | 'model' | null>(null);
    const [fileObject, setFileObject] = useState<File | null>(null);
    
    const [coverNeeded, setCoverNeeded] = useState(false);
    const [coverSrc, setCoverSrc] = useState<string | null>('');
    const [coverObject, setCoverObject] = useState<File | null>(null);

    const { upload, result, loading } = useUploadFile();

    function onChange(field: FormFieldProps) {
        setMetadata({ ...metadata, [field.name]: field.value });
    }
    
    function validateFile(file: File | null) {
        setFileType(null);
        setCoverNeeded(false);

        if (!file) return;

        const extension = file.name.split('.').at(-1);
        if (!extension) return 'Unknown file type';

        if (imageExtensions.includes(extension)) {
            setFileType('image');
        } else if (animationExtensions.includes(extension)) {
            setCoverNeeded(true);
            if (videoExtensions.includes(extension)) setFileType('video');
            else if (audioExtensions.includes(extension)) setFileType('audio');
            else if (modelExtensions.includes(extension)) setFileType('model');
        } else return 'Unknown file type';
    }

    function validateCover(file: File | null) {
        if (!file) return;

        const extension = file.name.split('.').at(-1);
        if (!extension || !imageExtensions.includes(extension)) return 'Unknown file type';
    }

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (fileObject) upload(fileObject, () => {
            console.log(result);
            if (coverNeeded && coverObject) upload(coverObject, () => console.log(result));
        });
    }

    return (
        <form action='#' className="flex flex-col items-center gap-8 p-8 mt-3 bg-black/5 dark:bg-white/10 rounded-2xl" onSubmit={onSubmit}>
            <div className="flex flex-row gap-16 flex-wrap justify-around"> 
                <Fieldset className="max-w-md gap-2 flex flex-col text-sm/6">
                    <Legend className="text-base/7 font-semibold mb-2">Metadata</Legend>
                    <FormField name="name" label="Name" description="Give a name to your NFT" required value={metadata.name} placeholder="My NFT" onChange={onChange}/>
                    <FormField name="symbol" label="Symbol" description="Create an abbreviature for NFT" required value={metadata.name} placeholder="This is my first NFT" onChange={onChange}/>
                    <FormField name="description" label="Description" description="Tell something about the NFT" required value={metadata.name} placeholder="MNFT" minLength={3} maxLength={5} onChange={onChange}/>
                    <FormField name="supply" label="Supply" description="How many NFTs do you want to sell" required value={metadata.name} placeholder="1" min={1} max={10000}/>
                    <FormField name="royaltyFee" label="Royalty fee" description="Percentage you earn from each resell" required value={metadata.name} placeholder="0" min={0} max={15} step={0.1} onChange={onChange}/>
                    <FormField name="royaltyReceiver" label="Royalty receiver" description="Address to receive royalties" required value={metadata.name} placeholder="0x1234..." onChange={onChange}/>
                    <FormField name="externalUrl" label="External link (optional)" description="Provide a link to socials/your page" value={metadata.name} placeholder="https://example.com" pattern="http(s)?://.*" onChange={onChange}/>
                </Fieldset>
                <Fieldset>
                    <Legend className="text-base/7 font-semibold mb-2">Content</Legend>
                    <FileSection validate={validateFile} onChange={(src, f) => (setFileSrc(src), setFileObject(f))}>
                        {fileType && fileSrc ? <Preview type={fileType} src={fileSrc}/> : <p>No file selected.</p>}
                    </FileSection>
                </Fieldset>
                <Fieldset disabled={!coverNeeded} className="disabled:opacity-50">
                    <Legend className="text-base/7 font-semibold mb-2">Cover</Legend>
                        <FileSection validate={validateCover} onChange={(src, f) => (setCoverSrc(src), setCoverObject(f))}>
                        {(coverNeeded ? coverSrc : fileSrc) ? <Image src={coverNeeded ? coverSrc! : fileSrc!} width={256} height={256} alt="cover"/> : <p>No file selected.</p>}
                    </FileSection>
                </Fieldset>
            </div>
            <Button type="submit" disabled={!fileSrc || (coverNeeded && !coverSrc) || loading} className="px-6 py-3 rounded-2xl bg-blue-500 text-gray-100 font-semibold hover:scale-110 transition-transform ease-in disabled:opacity-60">Create!</Button>
        </form>
    )
}