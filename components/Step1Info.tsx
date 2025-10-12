import { StepProps } from "@/app/create/page";
import { Box, Collapsible, Field, Fieldset, Input, Stack } from "@chakra-ui/react";

export default function Step1Info(props: StepProps) {
    return (
        <Stack>
            <Fieldset.Root size="lg" maxW="md">
                <Stack>
                    <Fieldset.Legend>NFT Info</Fieldset.Legend>
                    {/* <Fieldset.HelperText></Fieldset.HelperText> */}
                </Stack>
                <Fieldset.Content>
                    <Field.Root>
                        <Field.Label>Name</Field.Label>
                        <Input value={props.metadata.name} name="name" onChange={e => props.setMetadata({ ...props.metadata, name: e.currentTarget.value})} placeholder="My NFT"/>
                        <Field.HelperText>Give a name to your NFT.</Field.HelperText>
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Description</Field.Label>
                        <Input value={props.metadata.description} name="description" onChange={e => props.setMetadata({ ...props.metadata, description: e.currentTarget.value})} placeholder="My first NFT."/>
                        <Field.HelperText>Provide a description.</Field.HelperText>
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Symbol</Field.Label>
                        <Input value={props.metadata.symbol} name="symbol" onChange={e => props.setMetadata({ ...props.metadata, symbol: e.currentTarget.value})} placeholder="MNFT"/>
                        <Field.HelperText>Create an abbreviature for NFT.</Field.HelperText>
                    </Field.Root>
                    <Collapsible.Root>
                        <Collapsible.Trigger paddingY="3">Other settings</Collapsible.Trigger>
                        <Collapsible.Content>
                            <Box padding="4" borderWidth="1px">
                                <Field.Root>
                                    <Field.Label>Supply</Field.Label>
                                    <Input type="number" name="supply" value={props.metadata.supply} onChange={e => props.setMetadata({ ...props.metadata, supply: e.currentTarget.valueAsNumber || 0})} placeholder="MNFT"/>
                                    <Field.HelperText>The count of NFTs you want to create</Field.HelperText>
                                </Field.Root>
                            </Box>
                        </Collapsible.Content>
                    </Collapsible.Root>
                </Fieldset.Content>
            </Fieldset.Root>
        </Stack>
    )
}