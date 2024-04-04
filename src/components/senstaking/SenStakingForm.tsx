import React, { useState } from 'react';
import {
  GridItem,
  Stack,
  Heading,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Card,
  CardBody,
  textDecoration,
} from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import StakeToken from '@/app/sendashboard/senstaking/__components/StakeToken';
import UnstakeToken from '@/app/sendashboard/senstaking/__components/UnstakeToken';
import { useTab } from '@/contexts/tabContext';

const SenStakingForm = () => {
  const { address } = useAccount();

  const { selectedTab, setSelectedTab } = useTab();

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };

  return (
    <>
      {!address ? (
        <GridItem
          colSpan={2}
          order={2}
          // py={[6, 6, '3.101vw', '0.101vw']}
          alignItems="center"
          mt={[6, 10, '10.504vw']}
        >
          <Card>
            <CardBody>
              <Stack
                spacing={[3, 3, '0.752vw']}
                mt={[6, 6, '2.504vw']}
                align="center"
                justify="center"
                mb={[6, 6, '2.504vw']}
              >
                <Text color="white" fontSize={['md', 'md', 'lg']}>
                  Please connect your wallet to check your position.
                </Text>
              </Stack>
            </CardBody>
          </Card>
        </GridItem>
      ) : (
        <>
          <GridItem
            order={[2, '0.201vw']}
            colSpan={2}
            py={[6, 6, '0.101vw']}
            // borderLeft="1px solid rgba(232, 185, 106, 0.12)"
          >
            <Stack spacing={[3, 3, '0.752vw']} mt={[6, 6, '1.504vw']}>
              <Heading
                fontSize={['4xl', '5xl', '3.008vw']}
                letterSpacing={['-0.52px', '-0.52px', '-0.033vw']}
                fontWeight="400"
                px={[5, 5, '1.253vw']}
              >
                <Text
                  as="span"
                  color="white"
                  fontSize={['4xl', '5xl', '3.008vw']}
                >
                  Stake or&nbsp;
                </Text>

                <Text as="span" color="white">
                  Unstake&nbsp;
                </Text>
              </Heading>

              <Tabs
                index={selectedTab}
                onChange={handleTabChange}
                w="full"
                mb={[3, 3, '0.752vw']}
                px={[5, 5, '1.253vw']}
                isLazy
              >
                <TabList
                  w={['100%', '100%', '100%']}
                  display="flex"
                  flexWrap="wrap"
                  justifyContent="center"
                  mb={[3, 3, '0.552vw']}
                  px={[0, 0, '0vw']}
                  border="none"
                >
                  <Tab
                    color="text.secondary"
                    width="50%"
                    _hover={{
                      // borderBottomColor: 'rgba(232, 185, 106, 0.2)',
                      // borderBottom: '1px solid rgba(232, 185, 106, 0.12)',
                      textColor: 'brand.secondary',
                    }}
                    fontSize={['md', 'md', 'lg']}
                    _selected={{
                      borderBottomColor: 'rgba(232, 185, 106, 0.2)',
                      bg: 'transparent',
                      borderBottomWidth: '2px',
                      textColor: 'brand.secondary',
                    }}
                  >
                    Stake
                  </Tab>
                  <Tab
                    color="text.secondary"
                    width="50%"
                    _hover={{
                      // borderBottomColor: 'rgba(232, 185, 106, 0.2)',
                      // borderBottom: '1px solid',
                      // borderBotttomWidth: '50px',
                      textColor: 'brand.secondary',
                    }}
                    fontSize={['md', 'md', 'lg']}
                    _selected={{
                      borderBottomColor: 'rgba(232, 185, 106, 0.2)',
                      borderBottomWidth: '2px',
                      textColor: 'brand.secondary',
                    }}
                  >
                    Unstake
                  </Tab>
                </TabList>
                <TabPanels mb={0}>
                  <TabPanel>
                    <StakeToken />
                  </TabPanel>
                  <TabPanel w="100%">
                    <Stack spacing={[6, 6, '1.504vw']} py={[2, 2, '0.205vw']}>
                      <UnstakeToken />
                    </Stack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Stack>
          </GridItem>
        </>
      )}
    </>
  );
};

export default SenStakingForm;
