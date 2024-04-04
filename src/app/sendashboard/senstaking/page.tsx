'use client';
import { Box, Center, Heading, Text, Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import SenStatistics from '@/components/senstaking/SenStatistics';
import SenStakingForm from '@/components/senstaking/SenStakingForm';
import { SenStakingProvider } from '@/contexts/senStakingContext';
import { TabProvider } from '@/contexts/tabContext';

const SenStaking = () => {
  return (
    <SenStakingProvider>
      <TabProvider>
        <Box flexDirection={['column', 'column', 'column', 'row']}>
          <Center mb={[0, 4, '1.003vw']}>
            <Heading
              fontSize={['4xl', '5xl', '3.008vw']}
              letterSpacing={['-0.52px', '-0.52px', '-0.033vw']}
              textAlign="center"
              fontWeight="400"
            >
              <Text as="span" color="white" pr={[1, 1, '0.251vw']}>
                STAKE{' '}
              </Text>
              <Text as="span" fontStyle="italic" color="brand.secondary">
                SEN
              </Text>
            </Heading>
          </Center>
          <Flex
            direction={['column', 'column', 'column', 'row']}
            alignItems={'center'}
          >
            <Box w={['100%', '100%', '100%', '50%']} h="50%">
              <SenStatistics />
            </Box>
            <Box w={['100%', '100%', '100%', '50%']} h="50%">
              <SenStakingForm />
            </Box>
          </Flex>
        </Box>
      </TabProvider>
    </SenStakingProvider>
  );
};

export default dynamic(
  () => {
    return Promise.resolve(SenStaking);
  },
  { ssr: false }
);
