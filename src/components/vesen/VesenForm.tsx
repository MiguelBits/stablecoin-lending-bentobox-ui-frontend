import {
  GridItem,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';

import Locker from '@/app/sendashboard/vesen/_components/Lock';
import ViewLocks from '@/app/sendashboard/vesen/_components/Viewlocks';

const VesenForm = () => {
  return (
    <GridItem
      order={[2, '0.201vw']}
      colSpan={2}
      py={[6, 6, '0.101vw']}
      borderLeft="1px solid rgba(232, 185, 106, 0.12)"
    >
      <Stack spacing={[3, 3, '0.752vw']} mt={[6, 6, '1.504vw']}>
        <Heading
          fontSize={['4xl', '5xl', '3.008vw']}
          letterSpacing={['-0.52px', '-0.52px', '-0.033vw']}
          fontWeight="400"
          px={[5, 5, '1.253vw']}
        >
          <Text as="span" color="white" fontSize={['4xl', '5xl', '3.008vw']}>
            LOCK&nbsp;
          </Text>

          <Text as="span" color="white">
            BPT&nbsp;
          </Text>
        </Heading>

        <Tabs w="full" mb={[3, 3, '0.752vw']} px={[5, 5, '1.253vw']} isLazy>
          <TabList
            w={['100%', '100%', '100%']}
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            mb={[3, 3, '0.552vw']}
            px={[0, 0, '0vw']}
          >
            <Tab
              color="text.secondary"
              width={'50%'}
              _hover={{ backgroundColor: 'rgba(232, 185, 106, 0.2)' }}
              fontSize={['md', 'md', '1.111vw']}
            >
              Lock
            </Tab>
            <Tab
              color="text.secondary"
              width={'50%'}
              _hover={{ backgroundColor: 'rgba(232, 185, 106, 0.2)' }}
              fontSize={['md', 'md', '1.111vw']}
            >
              Your Locks
            </Tab>
          </TabList>
          <TabPanels mb={0}>
            <TabPanel>
              <Locker />
            </TabPanel>
            <TabPanel w="100%">
              <Stack spacing={[6, 6, '1.504vw']} py={[2, 2, '0.205vw']}>
                <ViewLocks />
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </GridItem>
  );
};

export default VesenForm;
