import { Description, Field, Input, Label } from "@headlessui/react";

export interface FormFieldProps {
    label: string;
    description: string;
    value: unknown;
    name: string;
    required?: boolean;
    disabled?: boolean;
    max?: number;
    min?: number;
    minLength?: number;
    maxLength?: number;
    step?: number;
    pattern?: string;
    placeholder?: string;
    type?: string;
    onChange?: (field: FormFieldProps) => void;
}

export default function FormField(props: FormFieldProps) {
    return (
        <Field>
            <Label className="font-medium">{props.label}</Label>
            <Description className="text-gray-500 dark:text-gray-400">{props.description}</Description>
            <Input
                required={props.required}
                placeholder={props.placeholder}
                max={props.max}
                min={props.min}
                minLength={props.minLength}
                maxLength={props.maxLength}
                pattern={props.pattern}
                value={String(props.value)}
                onChange={() => props.onChange?.(props)}
                type={props.type}
                className='mt-3 block w-full rounded-lg border-none bg-black/5 dark:bg-white/10 px-3 py-1.5
                focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 not-invalid:data-focus:outline-black/25 dark:data-focus:outline-white/25
                data-focus:invalid:outline-red-500'
            />
        </Field>
    )
}