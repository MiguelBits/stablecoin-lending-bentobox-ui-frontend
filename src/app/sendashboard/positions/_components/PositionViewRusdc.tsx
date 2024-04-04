import React from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useContractRead } from 'wagmi';
import {
  VStack,
  Card,
  CardBody,
  Flex,
  HStack,
  Icon,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Text,
  Box,
  Image,
} from '@chakra-ui/react';

import { useBorrowContext } from '@/contexts/borrowContext';
import { useContractContext } from '@/contexts/contractContext';

const PositionViewRusdc = () => {
  const { address } = useAccount();
  const { contracts } = useContractContext();
  const router = useRouter();
  const {
    activeCollateralToken,
    collateralTokenBalance,
    collateralTokenAllowance,
    senTokenBalance,
    senUSDTokenAllowance,
    healthFactor,
    accountInformation,
    tvlCalculation,
    minHealthFactor,
    senTokenLeftToMint,
    interestRate,
    feePercentage,
    depositedCollateral,
    liquidationPrice,
    liquidationThreshold,
    maxMintable,
    mintableSenTokens,
    refetchData,
  } = useBorrowContext();

  const { data: userPositionInfoDataRusdc } = useContractRead({
    ...contracts.RUSDC_ENGINE,
    functionName: 'getUserPositionInfo',
    args: [address as `0x${string}`],
  });

  const { data: userDepositedCollateral } = useContractRead({
    ...contracts.RUSDC_ENGINE,
    functionName: 'getCollateralBalanceOfUser',
    args: [address as `0x${string}`, contracts.RUSDC.address],
  });

  console.log('rusdc sen amount', userPositionInfoDataRusdc);

  const SenUsdAmountOfUserRusdcEngine =
    Number(userPositionInfoDataRusdc?.[0] || 0) / 1e18;

  const CollateralUsdAmountOfUserRusdcEngine =
    Number(userPositionInfoDataRusdc?.[2] || 0) / 1e18;

  const LiquidationPriceForRusdc =
    Number(userPositionInfoDataRusdc?.[1]) / 1e18;
  const LiquidationPriceForRusdcFixed = LiquidationPriceForRusdc.toFixed(4);

  return (
    <VStack width={['100%', '100%', '100%', '100%']}>
      <VStack mt={[0, 4, '1.003vw']}>
        <Text
          color="white"
          fontWeight={500}
          fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
        >
          INDIVIDUAL POSITIONS FOR RUSDC
        </Text>
      </VStack>
      {Number(userDepositedCollateral) > 0 ? (
        <Card
          width={['100%', '100%', '100%', '50%']}
          mb={[0, 4, '1.003vw']}
          rounded="3xl"
          background={'blackAlpha.500'}
        >
          <CardBody>
            <HStack>
              <Text color="white" mb={[0, 4, '1.003vw']}>
                RUSDC CHAMBER
              </Text>
            </HStack>
            <HStack>
              <Image
                src="/images/collateralTokens/rusdc2.png"
                w={['8', '12', '14', '16']}
                h={['8', '12', '14', '16']}
              />

              <Flex w={'100%'} justifyContent={'flex-start'}>
                <VStack alignItems={'flex-start'}>
                  <Text
                    fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
                    color={'white'}
                  >
                    {Number(userDepositedCollateral) / 1e18} rUSDC
                  </Text>
                  <Text
                    fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
                    color={'white'}
                  >
                    ~${CollateralUsdAmountOfUserRusdcEngine}
                  </Text>
                </VStack>
              </Flex>
              <HStack justifyContent={'flex-end'}>
                <Button
                  variant={'brandYellowFill'}
                  justifyContent={'flex-end'}
                  fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
                  onClick={() => {
                    router.push(`./borrow?token=${contracts.RUSDC.address}`);
                  }}
                >
                  Add
                </Button>
                <Button
                  variant={'brandYellowFill'}
                  justifyContent={'flex-end'}
                  fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
                  onClick={() => {
                    router.push(
                      `./borrow?token=${contracts.RUSDC.address}&isWithdraw=true`
                    );
                  }}
                >
                  Remove
                </Button>
              </HStack>
            </HStack>
            <Flex backgroundColor={''} mt={[0, 4, '1.003vw']}>
              <Text color={'white'}>
                Liquidation Price $ {LiquidationPriceForRusdcFixed}
              </Text>
            </Flex>

            <Text
              fontSize={['sm', 'sm', '0.877vw']}
              color="brand.secondary"
            ></Text>
          </CardBody>

          <Box overflowX="auto">
            <HStack
              mt={4}
              justifyContent="space-around"
              align="center"
              width="100%"
            >
              <Text
                color="text.secondary"
                fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
              >
                Deposited Collateral
              </Text>
              <Text
                color="text.secondary"
                fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
              >
                senUSD Borrowed
              </Text>
            </HStack>
            <HStack justifyContent={'space-around'} marginTop={5}>
              <HStack marginBottom={5}>
                <Text
                  fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
                  color={'white'}
                >
                  {Number(userDepositedCollateral) / 1e18} rUSDC
                </Text>
              </HStack>

              <HStack justifyContent={'flex-end'} marginBottom={5}>
                <Text
                  color={'white'}
                  fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
                >
                  {SenUsdAmountOfUserRusdcEngine}
                </Text>
              </HStack>
            </HStack>
          </Box>
        </Card>
      ) : (
        <Card
          width={['100%', '100%', '100%', '50%']}
          mb={[0, 4, '1.003vw']}
          rounded="3xl"
          background={'blackAlpha.500'}
        >
          <CardBody>
            <HStack justifyContent={'center'}>
              <Text color="white" mb={[0, 4, '1.003vw']}>
                You dont have any position opened for this Collateral
              </Text>
            </HStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
};

export default PositionViewRusdc;
