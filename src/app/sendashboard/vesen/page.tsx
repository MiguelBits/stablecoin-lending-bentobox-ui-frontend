'use client';
import {
  Box,
  Center,
  Heading,
  Text,
  Card,
  CardBody,
  Flex,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import VesenForm from '@/components/vesen/VesenForm';
import VesenStatistics from '@/components/vesen/VesenStatistics';
import { VesenProvider } from '@/contexts/vesenContext';

const Vesen = () => {
  return (
    <VesenProvider>
      <Box>
        <Center mb={[0, 4, '1.003vw']}>
          <Heading
            fontSize={['4xl', '5xl', '3.008vw']}
            letterSpacing={['-0.52px', '-0.52px', '-0.033vw']}
            textAlign="center"
            fontWeight="400"
          >
            <Text as="span" color="white" pr={[1, 1, '0.251vw']}>
              LOCK{' '}
            </Text>
            <Text as="span" fontStyle="italic" color="brand.secondary">
              80SEN-20WETH
            </Text>
          </Heading>
        </Center>
        <Card>
          <CardBody p={0}>
            <Flex direction={{ base: 'column', md: 'row' }}>
              <Box w={{ base: '100%', md: '50%' }} h="50%">
                <VesenStatistics />
              </Box>
              <Box w={{ base: '100%', md: '50%' }} h="50%">
                <VesenForm />
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </Box>
    </VesenProvider>
  );
};

export default dynamic(
  () => {
    return Promise.resolve(Vesen);
  },
  { ssr: false }
);
