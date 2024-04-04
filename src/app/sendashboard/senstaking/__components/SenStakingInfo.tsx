import { Card, CardBody, HStack, Icon, Stack, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useAccount, useBalance, useContractRead } from 'wagmi';
import { readContract } from 'viem/dist/types/actions/public/readContract';

import { useContractContext } from 'contexts/contractContext';

import TokenLogo from 'assets/logos/token-logo.svg';

import InfoStatImage from '@/components/InfoStatImage';
import { VesenProvider } from '@/contexts/vesenContext';
import { useTab } from '@/contexts/tabContext';
import registryAbi from 'contracts/abi/registryAbi.json';

const SenStakingInfo = () => {
  const APR = 'TEST APR';

  const { address } = useAccount();
  const { contracts } = useContractContext();
  const { selectedTab } = useTab();

  const { data: senTokenBalance } = useBalance({
    address,
    token: contracts.SEN.address,
    enabled: !!contracts && !!address,
  });

  const { data: sSenTokenBalance } = useBalance({
    address,
    token: contracts.SSEN.address,
    enabled: !!contracts && !!address,
  });

  const { data: totalAssets } = useContractRead({
    ...contracts.SSEN,
    functionName: 'totalAssets',
  });

  const { data: compoundAmount } = useContractRead({
    ...contracts.SSEN,
    functionName: 'compoundAmount',
  });

  const { data: previewReedem } = useContractRead({
    ...contracts.SSEN,
    functionName: 'previewRedeem',
    args: [1000000000000000000],
  });

  const { data: sSenRatio } = useContractRead({
    ...contracts.SSEN,
    functionName: 'previewDeposit',
    args: [1000000000000000000],
  });

  const { data: senRatio } = useContractRead({
    ...contracts.SSEN,
    functionName: 'previewWithdraw',
    args: [1000000000000000000],
  });

  const { data: collateralUsdValue } = useContractRead({
    ...contracts.ORACLE,
    functionName: 'getAmountPriced',
    args: [10, contracts.WETH?.address],
  });

  const formattedEthPrice = Number(collateralUsdValue) / 10;

  const {
    data: senPriceInEth,
    // refetch: refetchCollateralAllowance,
  } = useContractRead({
    ...contracts.REGISTRY,
    functionName: 'estimateAmountOut',
    args: [
      '0x7c2208a5aC67681dEE411af3FDAa7235e8b468d6',
      1000000000000000000,
      1,
    ],
  });

  console.log('priceofeth', formattedEthPrice);
  const formattedSenPriceInEth = Number(senPriceInEth) / 1e18;
  console.log('senPriceInEth', formattedSenPriceInEth);
  const priceOfSenInUsd =
    Number(formattedEthPrice) * Number(formattedSenPriceInEth);
  console.log('price of sen in usd', priceOfSenInUsd);
  const totalBalanceOfSenInUsd =
    Number(senTokenBalance?.formatted) * priceOfSenInUsd;

  const apyFormula =
    ((Number(totalAssets) + Number(compoundAmount)) / Number(totalAssets)) **
      8760 -
    1;
  const formattedNumber = Number(apyFormula.toFixed(2));
  console.log('preview withdraw', senRatio);
  const apyFormulaPercentage = formattedNumber * 100;
  const ratioCalculation = Number(sSenRatio) / 1e18;
  const senRatioCalculation = Number(senRatio) / 1e18;
  const formattedRatio = Number(previewReedem) / 1e18;
  console.log('ratio sen', senRatioCalculation);

  console.log('ssen balance', sSenTokenBalance?.formatted);

  console.log('sen ratio', senRatio);
  const ratioInUsd = formattedRatio * priceOfSenInUsd;
  const sSENPrice = ratioInUsd * Number(sSenTokenBalance?.formatted);
  console.log('formattted ratio price', ratioInUsd);
  const tabContent = [
    `1 sSEN = ${Number(formattedRatio).toFixed(4)} SEN`,
    `1 sSEN = ${Number(formattedRatio).toFixed(4)} SEN`,
  ];

  return (
    <VesenProvider>
      <Stack
        spacing={[3, 3, '0.752vw']}
        mt={[6, 6, '0.504vw']}
        position="relative"
        // top="-1.5em"
      >
        <Card width={['100%', '100%', '100%', '100%']} padding={0}>
          <CardBody>
            <HStack justifyContent="space-between">
              <Text
                fontSize={['md', 'md', 'lg']}
                color="text.secondary"
                alignItems={'flex-start'}
              >
                Your Balance
              </Text>
              <Text
                fontSize={['md', 'md', '1.003vw']}
                color="text.secondary"
                alignItems={'flex-end'}
              >
                Staked
              </Text>
            </HStack>

            <HStack justifyContent="space-between" py={[3, 3, '0.752vw']}>
              <Text
                fontSize={['md', 'md', 'lg']}
                color="brand.secondary"
                alignItems={'flex-start'}
              >
                {!address
                  ? 'N/A SEN'
                  : `${Number(senTokenBalance?.formatted).toFixed(6)}`}
              </Text>
              <Text
                fontSize={['md', 'md', 'lg']}
                color="brand.secondary"
                alignItems={'flex-end'}
              >
                {!address
                  ? 'N/A sSEN'
                  : `${Number(sSenTokenBalance?.formatted).toFixed(6)}`}
              </Text>
            </HStack>

            <HStack justifyContent="space-between">
              <Text
                fontSize={['md', 'md', 'lg']}
                color="white"
                alignItems={'flex-start'}
              >
                ${Number(totalBalanceOfSenInUsd).toFixed(4)}
              </Text>
              <Text
                fontSize={['md', 'md', 'lg']}
                color="white"
                alignItems={'flex-end'}
              >
                ${Number(sSENPrice).toFixed(4)}
              </Text>
            </HStack>
          </CardBody>
        </Card>

        <Card width={'100%'}>
          <CardBody>
            <HStack justifyContent="space-between" py={[3, 3, '0.752vw']}>
              <Text
                fontSize={['md', 'md', 'lg']}
                color="text.secondary"
                alignItems={'flex-start'}
              >
                Ratio
              </Text>
              <Text
                fontSize={['md', 'md', 'lg']}
                color="text.secondary"
                alignItems={'flex-end'}
              >
                Staking APR
              </Text>
            </HStack>

            <HStack justifyContent={'space-between'}>
              <Text
                fontSize={['md', 'md', 'lg']}
                color="brand.secondary"
                alignItems={'flex-start'}
              >
                {/* 1 sSEN = {ratioCalculation.toFixed(2)} SEN */}
                {tabContent[selectedTab]}
              </Text>
              <HStack justifyContent="end" marginLeft={17}>
                <Text
                  fontSize={['md', 'md', 'lg']}
                  color="brand.secondary"
                  alignItems={'flex-end'}
                >
                  {apyFormulaPercentage} %
                </Text>
                <InfoStatImage
                  marginRight={0}
                  marginLeft={0}
                  tooltipLabel={
                    <>
                      <HStack py={[3, 3, '0.752vw']}>
                        <Icon
                          as={TokenLogo}
                          w={[5, 5, '1.253vw']}
                          h={[5, 5, '1.253vw']}
                          fontSize={['md', 'md', 'lg']}
                        />
                        <Text fontSize={['md', 'md', 'lg']}>
                          SEN APR {apyFormulaPercentage}%{' '}
                        </Text>
                      </HStack>
                      <HStack py={[3, 3, '0.752vw']}>
                        {/* <Icon
                          as={TokenLogo}
                          w={[5, 5, '1.253vw']}
                          h={[5, 5, '1.253vw']}
                        />
                        <Text>{APR}</Text> */}
                      </HStack>
                    </>
                  }
                  label=""
                  value=""
                />
              </HStack>
            </HStack>

            {/* <HStack>
            <Text
              fontSize={['md', 'md', '1.003vw']}
              color="text.secondary"
              alignItems={'flex-start'}
              fontStyle={'italic'}
              py={[3, 3, '0.752vw']}
            >
              rewards are claimable each Thursday of the week
            </Text>
          </HStack> */}
          </CardBody>
        </Card>

        {/* <Card width={'100%'}>
        <CardBody>
          <HStack justifyContent="space-between" py={[3, 3, '0.752vw']}>
            <Text
              fontSize={['md', 'md', '1.003vw']}
              color="text.secondary"
              alignItems={'flex-start'}
            >
              Claimable
            </Text>
          </HStack>

          <HStack justifyContent="space-between">
            <Text
              fontSize={['md', 'md', '1.003vw']}
              color="brand.secondary"
              alignItems={'flex-start'}
            >
              0.00 SEN
            </Text>

            <Button
              color="white"
              w={['20%', '20%', '20%', '20%']}
              // fontSize={['md', 'md', '0.278vw']}
              border="1px solid rgba(232, 185, 106, 0.12)"
              backgroundColor="rgba(232, 185, 106, 0.2)"
              _hover={{ backgroundColor: 'rgba(232, 185, 106, 0.5)' }}
              size={['xs', 'sm', 'sm']}
              // isDisabled={true}
            >
              Claim
            </Button>
          </HStack>
        </CardBody>
      </Card> */}
      </Stack>
    </VesenProvider>
  );
};

export default SenStakingInfo;
