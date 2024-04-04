import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

import StakeForm from 'app/sendashboard/farmingoutofsync/_forms/Stake';
import UnStakeForm from 'app/sendashboard/farmingoutofsync/_forms/Unstake';

const FormTabs = () => {
  return (
    <Tabs w="full" mb={[3, 3, '0.752vw']} isLazy>
      <TabList
        w={['100%', '100%', 'auto']}
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        mb={[3, 3, '0.752vw']}
      >
        <Tab
          color="text.secondary"
          width={'50%'}
          _hover={{ backgroundColor: 'rgba(232, 185, 106, 0.2)' }}
        >
          Stake
        </Tab>
        <Tab
          color="text.secondary"
          width={'50%'}
          _hover={{ backgroundColor: 'rgba(232, 185, 106, 0.2)' }}
        >
          Unstake
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <StakeForm />
        </TabPanel>
        <TabPanel>
          <UnStakeForm />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default FormTabs;
