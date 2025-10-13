import { StepProps } from "@/app/page";
import { Box, Center, Fieldset, FileUpload, Flex, Float, SegmentGroup, Stack } from "@chakra-ui/react";
import Preview from "./Preview";
import { usePlausible } from "next-plausible";

const contentTypes = {
    image: "Image",
    other: "Audio/Video/3D Model/Other",
}

export default function Step2Content(props: StepProps) {
    const plausible = usePlausible();
    function onImageChange(files: File[]) {
        plausible("Uploaded Image");
        props.setMetadata({ ...props.metadata, imageUrl: files.length ? URL.createObjectURL(new Blob([files[0]])) : '', imageName: files[0]?.name || '' });
    }
    function onAnimationChange(files: File[]) {
        plausible("Uploaded Animation");
        props.setMetadata({ ...props.metadata, animationUrl: files.length ? URL.createObjectURL(new Blob([files[0]])) : undefined, animationName: files[0]?.name || undefined });
    }

    return (
        <Stack>
            <Fieldset.Root size="lg">
                <Stack>
                    <Fieldset.Legend>NFT Content</Fieldset.Legend>
                    <Fieldset.HelperText>If your NFT isn&apos;t an image, you should provide a cover in the image field.</Fieldset.HelperText>
                </Stack>
                <Fieldset.Content>
                    <SegmentGroup.Root value={props.metadata.isImage ? contentTypes.image : contentTypes.other} onValueChange={e => props.setMetadata({ ...props.metadata, isImage: e.value != contentTypes.other })} width={"fit-content"}>
                        <SegmentGroup.Indicator />
                        <SegmentGroup.Items items={[contentTypes.image, contentTypes.other]} />
                    </SegmentGroup.Root>
                    <Flex direction="row" gap={8}>
                        <FileUpload.Root maxFiles={1} accept={["image/*"]} onFileChange={e => onImageChange(e.acceptedFiles)} className="flex-1/2">
                            <FileUpload.HiddenInput/>
                            <FileUpload.Context>
                                {({ acceptedFiles: [file] }) => 
                                    file ?
                                        <FileUpload.ItemGroup>
                                            <FileUpload.Item file={file} key={file.name}>
                                                <Center className="size-full">
                                                    <Box className="size-50">
                                                            {props.metadata.imageUrl && <Preview src={props.metadata.imageUrl} fileName={file.name}/>}
                                                        <Float placement="top-end">
                                                            <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid"/>
                                                        </Float>
                                                    </Box>
                                                </Center>
                                            </FileUpload.Item>
                                        </FileUpload.ItemGroup>
                                    :
                                        <FileUpload.Dropzone w="full">
                                            <Box>Upload {props.metadata.isImage ? "Content" : "Cover"}</Box>
                                        </FileUpload.Dropzone>
                                }
                            </FileUpload.Context>
                        </FileUpload.Root>
                        {!props.metadata.isImage && (
                            <FileUpload.Root maxFiles={1} onFileChange={e => onAnimationChange(e.acceptedFiles)} className="flex-1/2">
                                <FileUpload.HiddenInput/>
                                <FileUpload.Context>
                                    {({ acceptedFiles: [file] }) => 
                                        file ?
                                            <FileUpload.ItemGroup>
                                                <FileUpload.Item file={file} key={file.name}>
                                                    <Center className="size-full">
                                                        <Box className="size-50">
                                                                {props.metadata.animationUrl && <Preview src={props.metadata.animationUrl} fileName={file.name}/>}
                                                            <Float placement="top-end">
                                                                <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid"/>
                                                            </Float>
                                                        </Box>
                                                    </Center>
                                                </FileUpload.Item>
                                            </FileUpload.ItemGroup>
                                        :
                                            <FileUpload.Dropzone w="full">
                                                <Box>Upload File</Box>
                                            </FileUpload.Dropzone>
                                    }
                                </FileUpload.Context>
                            </FileUpload.Root>
                        )}
                    </Flex>
                </Fieldset.Content>
            </Fieldset.Root>
        </Stack>
    )
}