import { GridItem, Stack, Heading, Button, Text } from '@chakra-ui/react';

import InfoStat from 'components/InfoStat';

import { useVesenContext } from '@/contexts/vesenContext';

const VesenStatistics = () => {
  const {
    vesen2TokenBalance,
    vesenTokenBalance,
    earliestUnlock,
    collateralUsdValue,
    readClaimableVesenRewards,
    claimVesenRewards,
  } = useVesenContext();
  //console.log(vesenTokenBalance);

  //console.log('collateral value', collateralUsdValue);
  function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return formattedDate + ' ' + formattedTime;
  }

  return (
    <>
      <GridItem colSpan={2} order={1}>
        <Stack
          spacing={[6, 6, '1.504vw']}
          px={[5, 5, '1.253vw']}
          py={[2, 2, '0.205vw']}
          borderBottom="1px solid rgba(232, 185, 106, 0.12)"
        >
          <Stack spacing={[3, 3, '0.752vw']} mt={[6, 6, '1.504vw']}>
            <Heading
              fontSize={['4xl', '5xl', '3.008vw']}
              letterSpacing={['-0.52px', '-0.52px', '-0.033vw']}
              fontWeight="400"
            >
              <Text
                as="span"
                color="white"
                fontSize={['2xl', '3xl', '2.008vw']}
              >
                VE
              </Text>
              <Text as="span" color="white">
                SEN
              </Text>
            </Heading>
            <InfoStat
              tooltipLabel="Value of the Collateral Deposited in your Position"
              label="My 80SEN-20WETH BPT"
              value={
                vesen2TokenBalance?.formatted
                  ? vesen2TokenBalance?.formatted
                  : '0'
              }
            />
            <InfoStat
              tooltipLabel="Total Value Locked"
              label="My Locked 80SEN-20WETH BPT"
              value={collateralUsdValue}
            />
            <InfoStat
              tooltipLabel="Your earliest unlock date"
              label="Earliest Unlock"
              value={formatTimestamp(Number(earliestUnlock))}
            />
            <InfoStat
              tooltipLabel="Your Amount Locked"
              label="My veSEN"
              value={
                vesenTokenBalance?.formatted
                  ? vesenTokenBalance?.formatted
                  : '0'
              }
            />

            <Stack
              mt={[4, 4, '1.003vw']}
              direction={['column', 'column', 'row']}
              spacing={[4, 4, '1.003vw']}
            >
              <Button variant="brandYellowFill" w="full">
                GET 80SEN-20WETH BPT
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </GridItem>
      <GridItem
        colSpan={2}
        order={3}
        borderRight="1px solid rgba(232, 185, 106, 0.12)"
      >
        <Stack
          spacing={[6, 6, '0.004vw']}
          px={[5, 5, '1.253vw']}
          mt={[4, 4, '1.5vw']}
        >
          <Stack spacing={[3, 3, '0.752vw']}>
            <Heading
              fontSize={['4xl', '5xl', '3.008vw']}
              letterSpacing={['-0.52px', '-0.52px', '-0.033vw']}
              fontWeight="400"
            >
              <Text
                as="span"
                color="white"
                fontSize={['4xl', '5xl', '3.008vw']}
              >
                TOTAL&nbsp;
              </Text>
              <Text
                as="span"
                color="white"
                fontSize={['2xl', '3xl', '2.008vw']}
              >
                VE
              </Text>
              <Text as="span" color="white">
                SEN&nbsp;
              </Text>
              <Text as="span" color="white">
                REWARDS
              </Text>
            </Heading>
            <InfoStat tooltipLabel="Total APR" label="APR" value="40.59% APR" />
            <InfoStat tooltipLabel="My SEN Rewards" label="SEN" value="$ 0.0" />
            <InfoStat
              tooltipLabel="Your total amount claimable"
              label="Total"
              value={Number(readClaimableVesenRewards)}
              color="brand.secondary"
            />

            <Stack
              mt={[4, 4, '1.003vw']}
              direction={['column', 'column', 'row']}
              spacing={[4, 4, '1.003vw']}
            >
              <Button
                variant="brandYellowFill"
                w="full"
                mb={0}
                onClick={claimVesenRewards}
              >
                CLAIM
              </Button>
            </Stack>
            <Stack
              mt={[4, 4, '3.003vw']}
              direction={['column', 'column', 'row']}
              spacing={[4, 4, '1.003vw']}
            ></Stack>
          </Stack>
        </Stack>
      </GridItem>
    </>
  );
};

export default VesenStatistics;
