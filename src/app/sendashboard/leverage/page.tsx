'use client';
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useRadioGroup,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';

import Statistics from 'components/Statistics';
import InfoStat from 'components/InfoStat';
import CustomRadio from 'components/CustomRadio';

import { NetworkOption } from 'models/network';

import { networkOptions as networkOptionsData } from 'constants/network';

import TokenLogo from 'assets/logos/token-logo.svg';
import SushiLogo from 'assets/logos/sushi-logo.svg';

import WalletBalanceInfo from '@/app/sendashboard/borrow/_components/WalletBalanceInfo';
import LeverageSettings from '@/app/sendashboard/leverage/_components/LeverageSettings';
import ComingSoon from 'app/sendashboard/leverage/_components/ComingSoon';

const Leverage = () => {
  const { getRadioProps: getNetworkRadioProps } = useRadioGroup({
    name: '0.25',
    defaultValue: '0.25',
    onChange: console.log,
  });
  const [networkOptions, setNetworkOptions] = useState<NetworkOption[]>([]);

  useEffect(() => {
    setNetworkOptions(networkOptionsData);
  }, []);

  return (
    <>
      <Box filter="blur(10px)">
        <Box height={100}></Box>
        <Center mb={[0, 4, '1.003vw']}>
          <Heading
            fontSize={['4xl', '5xl', '3.008vw']}
            letterSpacing={['-0.52px', '-0.52px', '-0.033vw']}
            textAlign="center"
            fontWeight="400"
          >
            <Text as="span" color="white" pr={[3, 3, '0.752vw']}>
              LEVERAGE{' '}
            </Text>
            <Text as="span" fontStyle="italic" color="brand.secondary">
              FARM
            </Text>
          </Heading>
        </Center>

        <Card zIndex={2}>
          <CardBody p={0}>
            <Grid
              templateRows={['auto', 'auto', 'auto', '1fr 0.7fr']}
              templateColumns={['1fr', '1fr', '1fr', 'repeat(4, 1fr)']}
            >
              <GridItem colSpan={2} order={1}>
                <Stack
                  spacing={[6, 6, '1.504vw']}
                  px={[5, 5, '1.253vw']}
                  py={[6, 6, '1.504vw']}
                >
                  <FormControl>
                    <Box
                      border="1px solid rgba(232, 185, 106, 0.12)"
                      py={[1, 1, '0.251vw']}
                      px={[2, 2, '0.501vw']}
                      borderRadius="md"
                    >
                      <Flex
                        gap={[2, 2, '0.501vw']}
                        overflowX="auto"
                        pb={[0.5, 0.5, '0.125vw']}
                        sx={{
                          '&::-webkit-scrollbar': {
                            height: [1.5, 1.5, '0.376vw'],
                            width: [1.5, 1.5, '0.376vw'],
                          },
                          '&::-webkit-scrollbar-track': {
                            background: 'dash.tooltip',
                            width: [1.5, 1.5, '0.376vw'],
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: 'background.tertiary',
                            borderRadius: '24px',
                          },
                        }}
                      >
                        {networkOptions?.map((option) => {
                          return (
                            <CustomRadio
                              key={option.value}
                              {...getNetworkRadioProps({ value: option.value })}
                            >
                              <HStack spacing={[2, 2, '0.501vw']}>
                                <Icon
                                  fontSize={['sm', 'sm', '0.877vw']}
                                  as={option.icon}
                                />
                                <Text fontSize={['xs', 'xs', '0.752vw']}>
                                  {option.label}
                                </Text>
                              </HStack>
                            </CustomRadio>
                          );
                        })}
                      </Flex>
                    </Box>
                  </FormControl>
                  <FormControl>
                    <FormLabel
                      color="text.secondary"
                      fontSize={['sm', 'sm', '0.877vw']}
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Text>Collateral Assets</Text>
                      <Text>0</Text>
                    </FormLabel>
                    <Box
                      color="text.secondary"
                      border="1px solid rgba(232, 185, 106, 0.12)"
                      py={[1, 1, '0.251vw']}
                      px={[2, 2, '0.501vw']}
                      borderRadius="md"
                    >
                      <Flex>
                        <Menu>
                          <MenuButton
                            w={['11.25rem', '11.25rem', '11.278vw']}
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                            zIndex={0.1}
                          >
                            <HStack spacing={[2, 2, '0.501vw']}>
                              <Icon
                                fontSize={['sm', 'sm', '0.877vw']}
                                as={SushiLogo}
                              />
                              <Text
                                fontSize={['sm', 'sm', '0.877vw']}
                                fontWeight="400"
                              >
                                xSUSHI
                              </Text>
                            </HStack>
                          </MenuButton>
                          <MenuList>
                            <MenuItem>xSUSHI</MenuItem>
                            <MenuItem>xSUSHI</MenuItem>
                            <MenuItem>xSUSHI</MenuItem>
                          </MenuList>
                        </Menu>
                        <InputGroup>
                          <Input
                            pl={[6, 6, '1.504vw']}
                            placeholder="0"
                            fontWeight="500"
                            variant="unstyled"
                          />
                        </InputGroup>
                      </Flex>
                    </Box>
                  </FormControl>

                  <LeverageSettings />
                </Stack>
              </GridItem>
              <GridItem
                colSpan={2}
                px={[5, 8, '2.005vw']}
                py={[6, 6, '1.504vw']}
                order={[3, 3, 2]}
                borderLeft="1px solid rgba(232, 185, 106, 0.12)"
              >
                <Grid templateColumns="repeat(2, 1fr)">
                  <GridItem>
                    <Grid
                      templateColumns={['1fr', '1fr', 'repeat(2, 1fr)']}
                      gap={[3, 3, 2, '0.501vw']}
                    >
                      <GridItem
                        display="flex"
                        alignItems={['center', 'center', 'flex-start']}
                        justifyContent={['center', 'center', 'flex-start']}
                        textAlign={['center', 'center', 'start']}
                      >
                        <Statistics label="Collateral Deposit" value="50440" />
                      </GridItem>
                      <GridItem
                        display="flex"
                        alignItems={['center', 'center', 'flex-start']}
                        justifyContent={['center', 'center', 'flex-start']}
                        textAlign={['center', 'center', 'start']}
                      >
                        <Statistics label="Liquidation Price" value="122.0" />
                      </GridItem>
                    </Grid>
                  </GridItem>

                  <GridItem>
                    <Grid
                      templateColumns={['1fr', '1fr', 'repeat(2, 1fr)']}
                      gap={[3, 3, 2, '0.501vw']}
                    >
                      <GridItem
                        display="flex"
                        alignItems={['center', 'center', 'flex-start']}
                        justifyContent={['center', 'center', 'flex-start']}
                        textAlign={['center', 'center', 'start']}
                      >
                        <Statistics label="senUSD Borrowed" value="55.3" />
                      </GridItem>
                      <GridItem
                        display="flex"
                        alignItems={['center', 'center', 'flex-start']}
                        justifyContent={['center', 'center', 'flex-start']}
                        textAlign={['center', 'center', 'start']}
                      >
                        <Statistics label="Collateral Value" value="18740.0" />
                      </GridItem>
                    </Grid>
                  </GridItem>
                </Grid>

                <Stack spacing={[3, 3, '0.752vw']} mt={[6, 6, '1.504vw']}>
                  <InfoStat
                    tooltipLabel="USD Value of the Collateral Deposited in your Position"
                    label="Collateral Value:"
                    value="$0.0"
                  />
                  <InfoStat
                    tooltipLabel="Total Value Locked"
                    label="TVL:"
                    value="$ 290.27k"
                  />
                  <InfoStat
                    tooltipLabel="senUSD Currently Borrowed in your Position"
                    label="senUSD Left To Borrow:"
                    value="$ 0.0"
                  />
                  <InfoStat
                    tooltipLabel="Withdrawable Amount"
                    label="Withdrawable Amount:"
                    value="1193.993"
                  />
                  {/* <Flex alignItems="center" justifyContent="space-between">
      <Flex
        alignItems={['flex-start', 'flex-start', 'center']}
        justifyContent={[
          'flex-start',
          'flex-start',
          'space-between',
        ]}
        w="full"
        flex="0.5"
        flexDirection={['column', 'column', 'row']}
      >
        <Text
          color="text.secondary"
          fontSize={['sm', 'sm', '0.877vw']}
        >
          1 Seneca
        </Text>
        <Text
          color="text.secondary"
          fontSize={['sm', 'sm', '0.877vw']}
        >
          1 USD
        </Text>
        <Text
          color="text.secondary"
          fontSize={['sm', 'sm', '0.877vw']}
        >
          1 WBNB
        </Text>
      </Flex>
      <Text
        color="text.secondary"
        fontSize={['sm', 'sm', '0.877vw']}
      >
        242.9924 Seneca
      </Text>
    </Flex> */}

                  <Stack
                    mt={[4, 4, '1.003vw']}
                    direction={['column', 'column', 'row']}
                    spacing={[4, 4, '1.003vw']}
                  >
                    <Button variant="brandYellowFill" w="full">
                      APPROVE
                    </Button>
                    <Button
                      variant="whiteAlphaOutline"
                      w={['full', 'full', 'fit-content']}
                      px={[12, 12, '3.008vw']}
                    >
                      NOTHING TO DO
                    </Button>
                  </Stack>
                </Stack>
              </GridItem>
              <GridItem
                colSpan={2}
                px={[5, 8, '2.005vw']}
                order={[2, 2, 3]}
                py={6}
                display="flex"
                w="full"
                alignItems="flex-end"
              >
                <Stack
                  spacing={[2.5, 2.5, '0.627vw']}
                  mt={[0, 0, 0, 16, '4.010vw']}
                  w="full"
                >
                  <Text
                    fontSize={['sm', 'sm', '0.877vw']}
                    color="text.secondary"
                  >
                    Your Wallet Balances
                  </Text>
                  <WalletBalanceInfo
                    token={TokenLogo}
                    tokenName="SEN"
                    value="1.1k"
                  />
                  <WalletBalanceInfo
                    token={SushiLogo}
                    tokenName="xSUSHI"
                    value="1.1k"
                  />
                </Stack>
              </GridItem>
              <GridItem
                colSpan={2}
                px={[5, 8, '2.005vw']}
                py={[6, 6, '1.504vw']}
                order={4}
                borderLeft="1px solid rgba(232, 185, 106, 0.12)"
              >
                <Stack spacing={[10, 10, '2.506vw']}>
                  <Stack spacing={[3, 3, '0.752vw']}>
                    <InfoStat
                      tooltipLabel="Maximum collateral ratio (MCR): MCR represents the maximum amount of debt a user can borrow with a selected collateral token."
                      label="Maximum collateral ratio:"
                      value="85%"
                    />
                    <InfoStat
                      tooltipLabel="This is the discount a liquidator gets when buying collateral flagged for liquidation."
                      label="Liquidation fee:"
                      value="10%"
                    />
                    <InfoStat
                      tooltipLabel="This fee is added to your debt every time you borrow SENECA."
                      label="Borrow fee:"
                      value="0.5%"
                    />
                    <InfoStat
                      tooltipLabel="This is the annualized percent that your debt will increase each year."
                      label="Interest:"
                      value="2%"
                    />
                    <InfoStat
                      tooltipLabel="Price of one collateral token."
                      label="Price:"
                      value="$ 243.1575"
                    />
                  </Stack>
                  <InfoStat
                    label="SENECA LEFT TO BORROW"
                    value="1.1k"
                    color="brand.secondary"
                  />
                </Stack>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      </Box>
      <Box>
        <ComingSoon />
      </Box>
    </>
  );
};

export default Leverage;
