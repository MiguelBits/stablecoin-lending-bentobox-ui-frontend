import React from 'react';
import {
  GridItem,
  Stack,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Box,
  HStack,
  VStack,
} from '@chakra-ui/react';

import SenStakingInfo from '@/app/sendashboard/senstaking/__components/SenStakingInfo';

const SenStatistics = () => {
  return (
    <GridItem
      order={[1, '0.201vw']}
      colSpan={2}
      py={[6, 6, '0.101vw']}
      // borderLeft="1px solid rgba(232, 185, 106, 0.12)"
    >
      <Stack spacing={[3, 3, '0.752vw']} mt={[6, 6, '1.504vw']}>
        <Heading
          fontSize={['sm', 'md', 'lg']}
          letterSpacing={['-0.52px', '-0.52px', '-0.033vw']}
          fontWeight="400"
          px={[5, 5, '1.253vw']}
        >
          <HStack align="flex-start" spacing={6}>
            <VStack py={[0, 0, '0.453vw']} align="flex-start">
              <Box
                h={['0.4rem', '0.4rem', '0.553vw']}
                w="1"
                bg="#E8B869"
                rounded="md"
              />
              <Box
                h={['0.4rem', '0.4rem', '0.553vw']}
                w="1"
                bg="#E8B869"
                rounded="md"
              />
              <Box
                h={['0.4rem', '0.4rem', '0.553vw']}
                w="1"
                bg="#E8B869"
                rounded="md"
              />
            </VStack>
            <Text as="span" color="white" fontSize={['4xl', '4xl', '3.008vw']}>
              SEN Token Staking&nbsp;
            </Text>
          </HStack>
        </Heading>

        <Tabs w="full" mb={[3, 3, '0.752vw']} px={[5, 5, '1.253vw']} isLazy>
          <TabList
            w={['50%', '50%', '50%']}
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            mb={[3, 3, '0.552vw']}
            px={[0, 0, '0vw']}
            alignItems={'flex-start'}
            rounded={'3xl'}
            border="none"
            //   _active={{ backgroundColor: 'rgba(232, 185, 106, 0.2)' }}
          >
            <Tab
              color="text.secondary"
              width={'100%'}
              fontSize={['sm', 'sm', 'md', 'md', '1.111vw']}
              rounded={'3xl'}
            >
              sSEN
            </Tab>
            {/* <Tab
            color="text.secondary"
            width={'50%'}
            _hover={{ backgroundColor: 'rgba(232, 185, 106, 0.2)' }}
            fontSize={['md', 'md', '1.111vw']}
          >
            Your Locks
          </Tab> */}
          </TabList>
          <TabPanels mb={0}>
            <TabPanel>
              <SenStakingInfo />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </GridItem>
  );
};

export default SenStatistics;
