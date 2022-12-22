import { Avatar, Box, Stack, Text, useColorModeValue, SlideFade } from '@chakra-ui/react';

export default function Founder() {
    return (
        <SlideFade in={true} offsetY='300px'>
            <Stack
                bg={useColorModeValue('gray.50', 'gray.800')}
                py={16}
                px={8}
                spacing={{ base: 8, md: 10 }}
                align={'center'}
                direction={'column'}>
                <Text
                    fontSize={{ base: 'xl', md: '2xl' }}
                    textAlign={'center'}
                    maxW={'3xl'}>
                    Bilal is a tech founder with a passion for web3 and decentralized technologies. To share his excitement about the potential of NFTs and the decentralized web, Bilal is giving away free NFTs to anyone who is interested. These NFTs represent unique, digital assets that can be bought, sold, and traded on the blockchain, and Bilal believes they have the power to revolutionize the way we think about ownership and value online. Whether you're a seasoned crypto enthusiast or just starting to learn about the world of NFTs, Bilal's free NFT giveaway is a great opportunity to get involved and explore the exciting possibilities of web3.
                </Text>
                <Box textAlign={'center'}>
                    <Avatar
                        src={
                            'https://pbs.twimg.com/profile_images/1494465723338567680/lip7sXX-_400x400.jpg'
                        }
                        alt={'Bilal Shahid'}
                        mb={2}
                    />

                    <Text fontWeight={600}>Bilal Shahid</Text>
                    <Text fontSize={'sm'} color={useColorModeValue('gray.400', 'gray.400')}>
                        Founder
                    </Text>
                </Box>
            </Stack>
        </SlideFade>
    );
}