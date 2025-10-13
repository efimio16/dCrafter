import { StepProps, Trait } from "@/app/page";
import { Button, EmptyState, Field, Input, NativeSelect, Stack, Table, VStack } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";
import { LuTrash } from "react-icons/lu";

export default function Step3Traits(props: StepProps) {
    const plausible = usePlausible();
    function onTraitChange(index: number, newValue: Partial<Trait>) {
        plausible("Added a Trait");
        if (newValue.type) newValue.value = '';
        props.metadata.traits[index] = { ...props.metadata.traits[index], ...newValue };
        props.setMetadata({ ...props.metadata, traits: props.metadata.traits });
    }

    function onTraitRemove(index: number) {
        plausible("Removed a Trait");
        props.setMetadata({ ...props.metadata, traits: props.metadata.traits.toSpliced(index, 1) });
    }

    return (
        <Stack>
            {props.metadata.traits.length ?
                <Table.Root size="sm" borderWidth="1px" rounded="md">
                    <Table.Header>
                        <Table.Row bg="bg.subtle">
                            <Table.ColumnHeader>Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Type</Table.ColumnHeader>
                            <Table.ColumnHeader>Value</Table.ColumnHeader>
                            <Table.ColumnHeader></Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {props.metadata.traits.map((trait, index) => 
                            <Table.Row key={index}>
                                <Table.Cell>
                                    <Field.Root>
                                        <Input placeholder="Name" name="traitName" value={trait.name} onChange={e => onTraitChange(index, { name: e.currentTarget.value })}/>
                                    </Field.Root>
                                </Table.Cell>
                                <Table.Cell>
                                    <NativeSelect.Root>
                                        <NativeSelect.Field value={trait.type} onChange={e => onTraitChange(index, { type: e.currentTarget.value as "string" })}>
                                            <option value="string">String</option>
                                            <option value="number">Number</option>
                                            <option value="date">Date</option>
                                        </NativeSelect.Field>
                                        <NativeSelect.Indicator />
                                    </NativeSelect.Root>
                                </Table.Cell>
                                <Table.Cell>
                                    <Field.Root>
                                        <Input placeholder="Value" name="traitValue" value={trait.value} type={trait.type} onChange={e => onTraitChange(index, { value: e.currentTarget.value })}/>
                                    </Field.Root>
                                </Table.Cell>
                                <Table.Cell textAlign={"end"}>
                                    <Button variant={"outline"} onClick={() => onTraitRemove(index)}>
                                        <LuTrash/>
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table.Root>
            :
                <EmptyState.Root>
                    <EmptyState.Content>
                        <VStack textAlign="center">
                            <EmptyState.Title>No traits yet</EmptyState.Title>
                            <EmptyState.Description>
                                Add traits to your NFT such as rarity or eye color
                            </EmptyState.Description>
                        </VStack>
                    </EmptyState.Content>
                </EmptyState.Root>
            }

            <Button onClick={() => props.setMetadata({ ...props.metadata, traits: [...props.metadata.traits, { name: '', value: '', type: 'string' }] })}>Add Trait</Button>
        </Stack>
    )
}