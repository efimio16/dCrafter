import { NFTMetadata } from "@/app/page";
import { Accordion, Box, Card, Code, DataList, EmptyState, Flex, Float, HStack, SegmentGroup, Span, Tag, VStack } from "@chakra-ui/react";
import Preview from "./Preview";
import { useState } from "react";

export default function NFTCard(props: { metadata: NFTMetadata }) {
    const [cardMedia, setCardMedia] = useState('cover');
    
    return (
        <Card.Root flexDirection="row" overflow="hidden" w="fit-content">
            <Box position="relative" aspectRatio={"square"} className="group w-md h-md">
                <div style={{ display: props.metadata.isImage || cardMedia == 'cover' ? 'block' : 'none' }}>
                    <Preview src={props.metadata.imageUrl} fileName={props.metadata.imageName}/>
                </div>
                <div style={{ display: props.metadata.isImage || cardMedia == 'cover' ? 'none' : 'block' }} className="size-full">
                    {props.metadata.animationUrl && props.metadata.animationName && <Preview src={props.metadata.animationUrl} fileName={props.metadata.animationName}/>}
                </div>
                <Float display={props.metadata.isImage ? 'none' : undefined} placement="bottom-end" className="group-hover:visible group-hover:opacity-100  transition-opacitity duration-200" offsetX={20} offsetY={7}>
                    <SegmentGroup.Root value={cardMedia} onValueChange={e => setCardMedia(e.value || '')}>
                        <SegmentGroup.Indicator />
                        <SegmentGroup.Items items={['cover', 'content']} />
                    </SegmentGroup.Root>
                </Float>
            </Box>
            <Flex direction={'column'}>
                <Card.Body gap="2" flex={1}>
                    <Card.Title>
                        <HStack>
                            {props.metadata.name}
                            <Tag.Root textAlign={"end"}>
                                <Tag.Label>{props.metadata.symbol}</Tag.Label>
                            </Tag.Root>
                        </HStack>
                    </Card.Title>
                    <Card.Description>{props.metadata.description}</Card.Description>
                    <Accordion.Root collapsible minW={"sm"}>
                        <Accordion.Item value="traits">
                            <Accordion.ItemTrigger>
                                <Span flex="1">Traits</Span>
                                <Accordion.ItemIndicator />
                            </Accordion.ItemTrigger>
                            <Accordion.ItemContent>
                                <Accordion.ItemBody>
                                    {props.metadata.traits.length ?
                                        <DataList.Root orientation="horizontal">
                                            {props.metadata.traits.map((trait, index) => 
                                                <DataList.Item key={index}>
                                                    <DataList.ItemLabel>{trait.name}</DataList.ItemLabel>
                                                    <DataList.ItemValue>{trait.value}</DataList.ItemValue>
                                                </DataList.Item>
                                            )}
                                        </DataList.Root>
                                    :
                                        <EmptyState.Root>
                                            <EmptyState.Content>
                                                <VStack textAlign="center">
                                                    <EmptyState.Title>No traits</EmptyState.Title>
                                                </VStack>
                                            </EmptyState.Content>
                                        </EmptyState.Root>
                                    }
                                </Accordion.ItemBody>
                            </Accordion.ItemContent>
                        </Accordion.Item>
                        <Accordion.Item value="blockchain">
                            <Accordion.ItemTrigger>
                                <Span flex="1">Blockchain Details</Span>
                                <Accordion.ItemIndicator />
                            </Accordion.ItemTrigger>
                            <Accordion.ItemContent>
                                <Accordion.ItemBody>
                                    <DataList.Root orientation="horizontal">
                                        <DataList.Item>
                                            <DataList.ItemLabel>Chain</DataList.ItemLabel>
                                            <DataList.ItemValue>Polygon</DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>Contract</DataList.ItemLabel>
                                            <DataList.ItemValue>
                                                <Code>0x12345678912456723456</Code>
                                            </DataList.ItemValue>
                                        </DataList.Item>
                                    </DataList.Root>
                                </Accordion.ItemBody>
                            </Accordion.ItemContent>
                        </Accordion.Item>
                    </Accordion.Root>
                </Card.Body>
                <Card.Footer gap="2">
                    {/* <Button variant="solid">
                        <Link href="#">Open at OpenSea</Link>
                    </Button> */}
                    {/* <Button variant="ghost">Add to cart</Button> */}
                </Card.Footer>
            </Flex>
        </Card.Root>
    )
}