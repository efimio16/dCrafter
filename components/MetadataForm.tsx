import { Field, Label, Description, Input } from "@headlessui/react"
import { useState } from "react"

const fields = [
    { label: 'Name', description: 'Give a name to your NFT', required: true, type: 'string' },
    { label: 'Description', description: 'Tell something about the NFT', required: true, type: 'string' },
    { label: 'Supply', description: 'How many NFTs do you want to sell', required: true, type: 'number' },
    { label: 'Royalty', description: 'Percentage you earn from each resell', required: true, type: 'number' },
    { label: 'External link', description: 'Provide a link to socials/your page', required: false, type: 'url' },
]

export default function MetadataForm() {
    const states = [
        useState<any>(''), // Name
        useState<any>(''), // Description
        useState<any>(1), // Supply
        useState<any>(0), // Royalty
        useState<any>(''), // External link
    ]

    return (
        <div className="w-full max-w-md px-4 gap-2 flex flex-col text-sm/6 mt-4">
            {fields.map((field, i) => (
                <Field key={i}>
                    <Label className="font-medium">{field.label}</Label>
                    <Description className="text-gray-500 dark:text-gray-400">{field.description}</Description>
                    <Input
                        required={field.required}
                        value={String(states[i][0])}
                        onChange={e => states[i][1](e.currentTarget[field.type == 'number' ? 'valueAsNumber' : 'value'])}
                        type={field.type}
                        className='mt-3 block w-full rounded-lg border-none bg-black/5 dark:bg-white/10 px-3 py-1.5
                        focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 not-invalid:data-focus:outline-black/25 dark:data-focus:outline-white/25
                        data-focus:invalid:outline-red-500'
                    />
                </Field>
            ))}
        </div>
    )
}