'use client';

import { Field, Label, Description, Input, Fieldset, Legend, Button } from "@headlessui/react"
import { FormEvent, useState } from "react"
import Image from "next/image";
import Preview from "./Preview";
import FileSection from "./FilePicker";

type FieldName = 'name' | 'description' | 'supply' | 'royalty' | 'external_url';
const fields = [
    { name: 'name' as FieldName, label: 'Name', description: 'Give a name to your NFT', required: true, type: 'string', placeholder: 'My NFT' },
    { name: 'description' as FieldName, label: 'Description', description: 'Tell something about the NFT', required: true, type: 'string', placeholder: 'This is my first NFT' },
    { name: 'supply' as FieldName, label: 'Supply', description: 'How many NFTs do you want to sell', required: true, type: 'number', placeholder: '1', min: 1 },
    { name: 'royalty' as FieldName, label: 'Royalty', description: 'Percentage you earn from each resell', required: true, type: 'number', placeholder: '0', min: 0, max: 15 },
    { name: 'external_url' as FieldName, label: 'External link (optional)', description: 'Provide a link to socials/your page', required: false, type: 'url', placeholder: 'https://example.com' },
]

const videoExtensions = ['webm', 'mp4', 'm4v', 'ogv'];
const audioExtensions = ['ogg', 'oga', 'mp3', 'wav'];
const modelExtensions = ['gltf', 'glb'];
const animationExtensions = [...videoExtensions, ...audioExtensions, ...modelExtensions];
const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

export default function Form() {
    const [metadata, setMetadata] = useState<Record<FieldName, string | number>>({
        name: '',
        description: '',
        supply: 1,
        royalty: 0,
        external_url: '',
    });

    const [fileSrc, setFileSrc] = useState<string | null>('');
    const [fileType, setFileType] = useState<'audio' | 'video' | 'image' | 'model' | null>(null);
    
    const [coverNeeded, setCoverNeeded] = useState(false);
    const [coverSrc, setCoverSrc] = useState<string | null>('');
    
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
        console.log(metadata);
    }

    return (
        <form action='#' className="flex flex-col items-center gap-8 p-8 mt-3 bg-black/5 dark:bg-white/10 rounded-2xl" onSubmit={onSubmit}>
            <div className="flex flex-row w-max gap-16">
                <Fieldset className="w-full max-w-md gap-2 flex flex-col text-sm/6">
                    <Legend className="text-base/7 font-semibold">Metadata</Legend>
                    {fields.map((field, i) => (
                        <Field key={i}>
                            <Label className="font-medium">{field.label}</Label>
                            <Description className="text-gray-500 dark:text-gray-400">{field.description}</Description>
                            <Input
                                required={field.required}
                                placeholder={field.placeholder}
                                max={field.max}
                                min={field.min}
                                {...(field.type === 'url' ? { pattern: "http(s)?://.*" } : {})}
                                value={String(metadata[field.name])}
                                onChange={e => setMetadata({ ...metadata, [field.name]: e.currentTarget[field.type == 'number' ? 'valueAsNumber' : 'value'] })}
                                type={field.type}
                                className='mt-3 block w-full rounded-lg border-none bg-black/5 dark:bg-white/10 px-3 py-1.5
                                focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 not-invalid:data-focus:outline-black/25 dark:data-focus:outline-white/25
                                data-focus:invalid:outline-red-500'
                            />
                        </Field>
                    ))}
                </Fieldset>
                <Fieldset>
                    <Legend className="text-base/7 font-semibold">Content</Legend>
                    <FileSection validate={validateFile} onSrcChange={setFileSrc}>
                        {fileType && fileSrc ? <Preview type={fileType} src={fileSrc}/> : <p>No file selected.</p>}
                    </FileSection>
                </Fieldset>
                <Fieldset disabled={!coverNeeded} className="disabled:opacity-50">
                    <Legend className="text-base/7 font-semibold">Cover</Legend>
                        <FileSection validate={validateCover} onSrcChange={setCoverSrc}>
                        {(coverNeeded ? coverSrc : fileSrc) ? <Image src={coverNeeded ? coverSrc! : fileSrc!} width={256} height={256} alt="cover"/> : <p>No file selected.</p>}
                    </FileSection>
                </Fieldset>
            </div>
            <Button type="submit" disabled={!fileSrc || (coverNeeded && !coverSrc)} className="px-6 py-3 rounded-2xl bg-blue-500 text-gray-100 font-semibold hover:scale-110 transition-transform ease-in disabled:opacity-60">Create!</Button>
        </form>
    )
}