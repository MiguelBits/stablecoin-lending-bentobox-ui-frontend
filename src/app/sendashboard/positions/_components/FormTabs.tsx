import {
  AccordionPanel,
  Container,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';

import ZapForm from 'app/sendashboard/stakingoutofsync/_forms/ZapForm';
import AddLiquidityForm from 'app/sendashboard/stakingoutofsync/_forms/AddLiquidityForm';
import RemoveLiquidityForm from 'app/sendashboard/stakingoutofsync/_forms/RemoveLiquidityForm';
import StakeForm from 'app/sendashboard/stakingoutofsync/_forms/StakeForm';
import UnStakeForm from 'app/sendashboard/stakingoutofsync/_forms/UnstakeForm';
import ClaimForm from 'app/sendashboard/stakingoutofsync/_forms/ClaimForm';
import CalcForm from 'app/sendashboard/stakingoutofsync/_forms/CalcForm';

const FormTabs = () => {
  return (
    <AccordionPanel py={4}>
      <Container
        maxW="container.md"
        alignItems="center"
        justifyContent="center"
      >
        <Tabs w="full" mb={[3, 3, '0.752vw']} isLazy>
          <TabList
            w={['100%', '100%', 'auto']}
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            mb={[3, 3, '0.752vw']}
          >
            <Tab color="text.secondary">Zap</Tab>
            <Tab minW="fit-content" color="text.secondary">
              Add Collateral/Borrow
            </Tab>
            <Tab minW="fit-content" color="text.secondary">
              Repay SenUSD
            </Tab>
            <Tab minW="fit-content" color="text.secondary">
              Stake
            </Tab>
            <Tab minW="fit-content" color="text.secondary">
              Unstake
            </Tab>
            <Tab minW="fit-content" color="text.secondary">
              Claim
            </Tab>
            <Tab minW="fit-content" color="text.secondary">
              Calc
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ZapForm />
            </TabPanel>
            <TabPanel>
              <AddLiquidityForm />
            </TabPanel>
            <TabPanel>
              <RemoveLiquidityForm />
            </TabPanel>
            <TabPanel>
              <StakeForm />
            </TabPanel>
            <TabPanel>
              <UnStakeForm />
            </TabPanel>
            <TabPanel>
              <ClaimForm />
            </TabPanel>
            <TabPanel>
              <CalcForm />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </AccordionPanel>
  );
};

export default FormTabs;
