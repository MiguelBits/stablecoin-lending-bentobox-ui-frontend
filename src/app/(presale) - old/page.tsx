'use client';
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Link,
  Progress,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useNetwork } from 'wagmi';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';

import Statistics from 'components/Statistics';
import InfoStat from 'components/InfoStat';
import CopyToClipboardButton from 'components/CopyToClipboardButton';

import { formatWalletAddress } from 'lib/utils/formatWalletAddress';
import { getChainDefaultAddressUrl } from 'lib/utils/getChainDefaultAddressUrl';

import { useSaleContext } from 'contexts/saleContext';
import { useContractContext } from 'contexts/contractContext';

// import TokenLogo from 'assets/logos/token-logo.svg';

import PresaleForm from '@/app/(presale)/_forms/PresaleForm';
import WalletBalanceInfo from 'app/sendashboard/borrow/_components/WalletBalanceInfo';

import USDTLogo from '../../../node_modules/cryptocurrency-icons/svg/color/usdt.svg';

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(advanced);

const Home = () => {
  const { chain } = useNetwork();
  const { contracts } = useContractContext();
  const {
    saleStage,
    ratePer1e18,
    remainingTokens,
    saleCap,
    minPurchase,
    maxPurchase,
    amountPurchased,
    amountClaimed,
    amountVested,
    usdtBalance,
    vestingPeriod,
  } = useSaleContext();

  return (
    <Box>
      <Center mb={[0, 4, '1.003vw']}>
        <Heading
          fontSize={['4xl', '5xl', '3.008vw']}
          letterSpacing={['-0.52px', '-0.52px', '-0.033vw']}
          textAlign="center"
          fontWeight="400"
        >
          <Text as="span" fontStyle="italic" color="brand.secondary">
            SENECA
          </Text>
          <Text as="span" pl={[3, 3, '0.752vw']}>
            TOKEN PRE-SALE IS LIVE!
          </Text>
        </Heading>
      </Center>
      <Card>
        <CardBody p={0}>
          <Grid templateColumns={['1fr', '1fr', '1fr', 'repeat(2, 1fr)']}>
            <GridItem order={1}>
              <Grid gridTemplateRows={['1fr', '1fr', '0.9fr 1fr']} h="full">
                <GridItem
                  px={[5, 5, '1.253vw']}
                  py={[6, 6, '1.504vw']}
                  borderBottom="1px solid rgba(232,185,106,0.12)"
                >
                  <Stack gap={[6, 6, '1.003vw']}>
                    <Stack spacing={[2, 2, '0.501vw']}>
                      <InfoStat
                        tooltipLabel={`Seneca Protocol undergoes a Private Round (STAGE 1). ${saleCap.toLocaleString()} SEN are being sold at a price of $${ratePer1e18} per token. The Round has a total amount to be raised of $440,000.`}
                        label="Presale Stage"
                        flexDirection={['row', 'row', 'row']}
                        value={
                          <Badge
                            w="fit-content"
                            borderRadius="full"
                            px={[2, 2, '0.501vw']}
                            py={[0.5, 0.5, '0.125vw']}
                          >
                            Presale Stage {saleStage}
                          </Badge>
                        }
                      />
                      <InfoStat
                        tooltipLabel={`Seneca Protocol undergoes a Private Round (STAGE 1). ${saleCap.toLocaleString()} SEN are being sold at a price of $${ratePer1e18} per token. The Round has a total amount to be raised of $440,000.`}
                        label="Launch Price"
                        flexDirection={['row', 'row', 'row']}
                        value={` 1 $SEN = ${ratePer1e18} $USDT`}
                      />
                    </Stack>

                    <Stack spacing={[4, 4, '1.003vw']} mt={[10, 10, '2.506vw']}>
                      <Text
                        color="brand.secondary"
                        fontWeight="600"
                        textAlign="center"
                        fontSize={['md', 'md', '1.003vw']}
                      >
                        $SEN Remaining &#x2015;{' '}
                        {Math.round(remainingTokens).toLocaleString()} /{' '}
                        {saleCap.toLocaleString()}
                      </Text>
                      <Stack spacing={[1, 1, '0.251vw']}>
                        <Progress
                          min={0}
                          value={((saleCap - remainingTokens) / saleCap) * 100}
                          max={100}
                          h={[2, 2, '0.501vw']}
                          w="full"
                        />
                        <Flex
                          alignItems="center"
                          w="full"
                          justifyContent="flex-end"
                        >
                          <Text
                            fontSize={['xs', 'xs', '0.752vw']}
                            color="text.secondary"
                          >
                            {saleCap.toLocaleString()} SEN
                          </Text>
                        </Flex>
                      </Stack>
                    </Stack>
                  </Stack>
                </GridItem>
                <GridItem px={[5, 5, '1.253vw']} py={[6, 6, '1.504vw']}>
                  <Stack spacing={[6, 6, '1.504vw']}>
                    <Stack spacing={[6, 6, '0.833vw']} mt={[6, 6, '0.833vw']}>
                      <InfoStat
                        tooltipLabel="Private Sale Address"
                        label="Private Sale Address"
                        value={
                          <HStack spacing={[2, 2, '0.501vw']}>
                            <Link
                              isExternal
                              color="brand.secondary"
                              textDecoration="underline"
                              fontSize={['sm', 'sm', '0.877vw']}
                              href={getChainDefaultAddressUrl(
                                chain,
                                contracts.SENECA_SALE.address
                              )}
                            >
                              {formatWalletAddress(
                                contracts.SENECA_SALE.address
                              )}
                            </Link>
                            <CopyToClipboardButton
                              textToBeCopied={contracts.SENECA_SALE.address}
                            />
                          </HStack>
                        }
                      />
                      <InfoStat
                        tooltipLabel={`The minimum amount of $SEN you can buy is ${Math.round(
                          minPurchase
                        ).toLocaleString()} SENECA for $${Math.round(
                          minPurchase * ratePer1e18
                        ).toLocaleString()}`}
                        label="Minimum Buy"
                        value={`$${Math.round(
                          minPurchase * ratePer1e18
                        ).toLocaleString()}`}
                      />
                      <InfoStat
                        tooltipLabel={`The maximum amount of $SEN you can buy is ${Math.round(
                          maxPurchase
                        ).toLocaleString()} SENECA for $${(
                          Math.ceil((maxPurchase * ratePer1e18) / 10000) * 10000
                        ).toLocaleString()}`}
                        label="Maximum Buy"
                        value={`$${(
                          Math.ceil((maxPurchase * ratePer1e18) / 10000) * 10000
                        ).toLocaleString()}`}
                      />
                      <InfoStat
                        alignItems="flex-start"
                        tooltipLabel={`Vesting Period: 10% unlocked at TGE, 90% linearly vested over ${Math.round(
                          vestingPeriod
                        )} Months`}
                        label="Vesting Period"
                        value={
                          <Stack
                            alignItems={[
                              'flex-start',
                              'flex-start',
                              'flex-end',
                            ]}
                            spacing={[2, 2, '0.501vw']}
                          >
                            <Text>10% unlocked at TGE</Text>
                            <Text>
                              90% linearly vested over{' '}
                              {Math.round(vestingPeriod)} Months
                            </Text>
                          </Stack>
                        }
                      />
                    </Stack>
                  </Stack>
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem
              order={[4, 4, 4, 2]}
              px={[5, 5, '1.253vw']}
              py={[6, 6, '1.504vw']}
              borderLeft="1px solid rgba(232, 185, 106, 0.12)"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Stack spacing={[2, 2, '0.501vw']}>
                <Stack mb={[6, 6, '1.504vw']} spacing={[2, 2, '0.501vw']}>
                  <Grid
                    templateColumns={['1fr', '1fr', 'repeat(3, 1fr)']}
                    gap={[3, 3, '0.752vw']}
                  >
                    <GridItem>
                      <Statistics
                        label="Purchased SENECA"
                        value={amountPurchased.toLocaleString()}
                      />
                    </GridItem>
                    <GridItem>
                      <Statistics
                        label="Amount Vested"
                        value={amountVested.toLocaleString()}
                      />
                    </GridItem>
                    <GridItem>
                      <Statistics
                        label="Amount Claimed"
                        value={amountClaimed.toLocaleString()}
                      />
                    </GridItem>
                  </Grid>
                </Stack>
                <PresaleForm />
              </Stack>

              <Stack
                spacing={[2.5, 2.5, '0.627vw']}
                // mt={[4, 4, '0.905vw', '4.010vw']}
              >
                <Text fontSize={['sm', 'sm', '0.877vw']} color="text.secondary">
                  Your Wallet Balances
                </Text>
                {/* <WalletBalanceInfo
                  token={TokenLogo}
                  tokenName="SEN"
                  value={amountPurchased.toLocaleString()}
                /> */}
                <WalletBalanceInfo
                  token={USDTLogo}
                  tokenName="USDT"
                  value={usdtBalance.toLocaleString()}
                />
              </Stack>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Home;
