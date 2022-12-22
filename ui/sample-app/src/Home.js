import {
    Flex,
    Container,
    Heading,
    Stack,
    Text,
    Button,
    Image
} from '@chakra-ui/react';
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { claimNFT } from './service/claimNFT';

export default function Home() {
    const [user, setUser] = useState({ loggedIn: null })


    useEffect(() => fcl.currentUser.subscribe(setUser), [])

    const claimNFTHelper = async () => {
        if (!user.loggedIn) {
            await fcl.logIn();
        }
        await claimNFT();
    }
    return (
        <Container maxW={'5xl'}>
            <Stack
                textAlign={'center'}
                align={'center'}
                spacing={{ base: 8, md: 10 }}
                py={{ base: 20, md: 28 }}>
                <Heading
                    fontWeight={600}
                    fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
                    lineHeight={'110%'}>
                    Claim your free holiday{' '}
                    <Text as={'span'} color={'green.300'}>
                        NFT
                    </Text>
                </Heading>
                <Text color={'gray.500'} maxW={'3xl'}>
                    Celebrate the Holidays by claiming your FREE NFT. That's right, you heard correctly FREE. Hurry while supplies last.
                </Text>
                <Stack spacing={6} direction={'row'}>
                    <Button
                        onClick={claimNFTHelper}
                        rounded={'full'}
                        px={6}
                        size="lg"
                        colorScheme={'green'}
                        bg={'green.300'}
                        _hover={{ bg: 'green.300' }}>
                        Claim Now!
                    </Button>
                    <Button rounded={'full'} px={6} size="lg">
                        Learn more
                    </Button>
                </Stack>
                <Flex w="75%">
                    <Image
                        width="100%"
                        src="banner.png"
                    />
                </Flex>
            </Stack>
        </Container>
    );
}