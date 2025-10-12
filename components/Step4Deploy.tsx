import { Fieldset, NativeSelect, RadioGroup, Show, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

const chains = [
    { label: "Polygon", value: "pol" },
    { label: "Ethereum", value: "eth" },
]

export default function Step4Deploy() {
    const [chainChoise, setChainChoise] = useState("auto");
    return (
        <Stack>
            <Fieldset.Root size="lg" maxW="md">
                <Fieldset.Legend>Deploy</Fieldset.Legend>
                <Fieldset.Content>
                    <Text>Chain</Text>
                    <RadioGroup.Root value={chainChoise} onValueChange={e => e.value && setChainChoise(e.value)}>
                        <Stack gap="6">
                            <RadioGroup.Item value={"auto"}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>Auto (cheapest)</RadioGroup.ItemText>
                            </RadioGroup.Item>
                            <RadioGroup.Item value={"custom"}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>Custom</RadioGroup.ItemText>
                            </RadioGroup.Item>
                        </Stack>
                    </RadioGroup.Root>
                    <Show when={chainChoise == "custom"}>
                        <NativeSelect.Root>
                            <NativeSelect.Field>
                                {chains.map(chain => 
                                    <option key={chain.value} value={chain.value}>{chain.label}</option>
                                )}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Show>
                </Fieldset.Content>
            </Fieldset.Root>
        </Stack>
    )
}