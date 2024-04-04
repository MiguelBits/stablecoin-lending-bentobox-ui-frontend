'use client';
import { Box, Button, Center, Container, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { LongLogo } from '@/components/Logo';

const Home = () => {
  const router = useRouter();

  return (
    <Container
      h="100vh"
      maxW={['full', 'full', 'xs']}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box w="full">
        <Center mb={8}>
          <LongLogo w={['12.5rem', '12.5rem', '12.531vw']} />
        </Center>
        <Center mb={[4, 4, '1.003vw']}>
          <Text fontSize={['lg', '2xl', '1.504vw']} color="white">
            Welcome
          </Text>
        </Center>
        <Center>
          <Button
            variant="brandYellowFill"
            w="full"
            onClick={() => {
              router.push('/sendashboard/chambers');
            }}
          >
            Enter App
          </Button>
        </Center>
      </Box>
    </Container>
  );
};

export default Home;
