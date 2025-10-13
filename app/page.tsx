'use client';
import NFTCard from "@/components/NFTCard";
import Step1Info from "@/components/Step1Info";
import Step2Content from "@/components/Step2Content";
import Step3Traits from "@/components/Step3Traits";
import Step4Deploy from "@/components/Step4Deploy";
import { Button, ButtonGroup, Center, Container, Heading, Stack, Steps } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";
import { useEffect, useState } from "react";

export interface NFTMetadata {
    name: string;
    symbol: string;
    description: string;
    supply: number;
    royaltyFee?: number;
    royaltyReceiver?: string;
    externalUrl?: string;
    imageUrl: string;
    imageName: string;
    animationUrl?: string;
    animationName?: string;
    traits: Trait[];
    isImage: boolean;
}

export interface Trait {
    name: string;
    type: 'string' | 'number' | 'date'; //  | 'boost_number' | 'boost_percentage'
    value: string | number;
}

export interface StepProps {
    metadata: NFTMetadata;
    setMetadata: (data: NFTMetadata) => void;
}

const steps = [
    {
        title: "Info",
        description: Step1Info,
    },
    {
        title: "Content",
        description: Step2Content,
    },
    {
        title: "Traits",
        description: Step3Traits,
    },
    {
        title: "Deploy",
        description: Step4Deploy,
    },
];

export default function CreateNFT() {
    const [metadata, setMetadata] = useState<NFTMetadata>({
        name: '',
        symbol: '',
        description: '',
        supply: 10000,
        royaltyFee: 0,
        traits: [],
        externalUrl: '',
        imageUrl: '',
        imageName: '',
        animationUrl: '',
        animationName: '',
        isImage: true,
    });

    const plausible = usePlausible();
    const [activeStep, setActiveStep] = useState(0);
    const isNextDisabled =
        activeStep === 0 && (!metadata.name || !metadata.description || !metadata.supply || !metadata.symbol) ||
        activeStep === 1 && (!metadata.imageUrl || (!metadata.isImage && !metadata.animationUrl));

    function onStepChange(e: { step: number }) {
        plausible(`${e.step > activeStep ? 'Go' : 'Return'} to Step ${e.step}`);
        setActiveStep(e.step);
    }

    useEffect(() => {
        const onUnload = () => {
            if (activeStep !== 4) plausible("Exited Before Preview");
        }
        const onVisibilityChange = () => {
            plausible({ "hidden": "Page hidden", "visible": "Page visible" }[document.visibilityState]);
        }

        document.addEventListener("visibilitychange", onVisibilityChange);
        window.addEventListener("beforeunload", onUnload);

        return () => {
            document.removeEventListener("visibilitychange", onVisibilityChange);
            window.removeEventListener("beforeunload", onUnload);
        }
    }, [activeStep]);

    return (
    <Center width={"100vw"}>
        <Stack>
            <Heading size={"3xl"}>Create NFT</Heading>
            <Steps.Root count={steps.length} width={"80vw"} step={activeStep} onStepChange={onStepChange}>
                <Steps.List>
                    {steps.map((step, index) => 
                        <Steps.Item key={index} index={index} title={step.title}>
                            <Steps.Indicator />
                            <Steps.Title>{step.title}</Steps.Title>
                            <Steps.Separator />
                        </Steps.Item>
                    )}
                </Steps.List>

                {steps.map((step, index) => 
                    <Steps.Content key={index} index={index}>
                        <Container height="70vh">
                            <step.description metadata={metadata} setMetadata={setMetadata}/>
                        </Container>
                    </Steps.Content>
                )}
                <Steps.CompletedContent overflow={"auto"} h={"70vh"}>
                    <Container>
                        <Heading size="2xl" mb='2'>Success!</Heading>
                        <NFTCard metadata={metadata}/>
                    </Container>
                </Steps.CompletedContent>

                {activeStep < 4 && <ButtonGroup size="lg" variant="outline" width={"100%"}>
                    <Steps.PrevTrigger asChild>
                        <Button width={"50%"}>Prev</Button>
                    </Steps.PrevTrigger>
                    <Steps.NextTrigger asChild>
                        <Button width={"50%"} disabled={isNextDisabled} variant={"solid"}>{activeStep === 3 ? 'Deploy' : 'Next'}</Button>
                    </Steps.NextTrigger>
                </ButtonGroup>}
            </Steps.Root>
        </Stack>
    </Center>)
}