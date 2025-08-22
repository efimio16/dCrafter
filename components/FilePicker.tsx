import { Fieldset, Legend, Field, Input, Button } from "@headlessui/react";
import { ReactNode, useRef, useState } from "react";

interface FilePickerProps {
    children: ReactNode;
    validate: (file: File | null) => string | void;
    onSrcChange: (src: string | null) => void;
}

export default function FilePicker(props: FilePickerProps) {
    const input = useRef<HTMLInputElement>(null);
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    function onChange(file: File | null) {
        setName('');
        setError('');
        const result = props.validate(file);
        if (result) {
            setError(result);
            props.onSrcChange(null);
        } else {
            if (file) {
                setName(file.name);
                props.onSrcChange(URL.createObjectURL(new Blob([file])));
            } else props.onSrcChange(null);
        }
    }
    return (
        <div className="flex items-center justify-center flex-col h-full">
            <div className="bg-black/5 flex gap-3 flex-col items-center p-3 dark:bg-white/10 rounded-2xl">
                <div className="size-100 flex-none flex items-center justify-center">{props.children}</div>
                <Field className="flex-1/2">
                    <Input required invalid={!!error} ref={input} type="file" className="hidden" onChange={e => onChange(e.currentTarget.files?.[0] || null)}/>
                    <Button className="px-3 py-1.5 rounded-2xl bg-blue-500 text-white" onClick={() => input.current?.click()}>{name || 'Choose a file'}</Button> 
                </Field>
            </div>
            {error && <span className="text-red-500">{error}</span>}
        </div>
    )
}