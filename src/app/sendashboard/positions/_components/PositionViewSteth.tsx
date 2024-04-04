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

const PositionViewSteth = () => {
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

  const { data: userPositionInfoDataSteth } = useContractRead({
    ...contracts.STETH_ENGINE,
    functionName: 'getUserPositionInfo',
    args: [address as `0x${string}`],
  });

  const { data: userDepositedCollateral } = useContractRead({
    ...contracts.STETH_ENGINE,
    functionName: 'getCollateralBalanceOfUser',
    args: [address as `0x${string}`, contracts.STETH.address],
  });

  console.log('balance of steth', userPositionInfoDataSteth);

  const SenUsdAmountOfUserStethEngine =
    Number(userPositionInfoDataSteth?.[0] || 0) / 1e18;

  const CollateralUsdAmountOfUserStethEngine =
    Number(userPositionInfoDataSteth?.[2] || 0) / 1e18;

  const LiquidationPriceForSteth =
    Number(userPositionInfoDataSteth?.[1]) / 1e18;
  const LiquidationPriceForStethFixed = LiquidationPriceForSteth.toFixed(4);

  return (
    <VStack width={['100%', '100%', '100%', '100%']}>
      <VStack mt={[0, 4, '1.003vw']}>
        <Text
          color="white"
          fontWeight={500}
          fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
        >
          INDIVIDUAL POSITIONS FOR STETH
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
                STETH CHAMBER
              </Text>
            </HStack>
            <HStack>
              <Image
                src="/images/collateralTokens/steth.png"
                w={['8', '12', '14', '16']}
                h={['8', '12', '14', '16']}
              />

              <Flex w={'100%'} justifyContent={'flex-start'}>
                <VStack alignItems={'flex-start'}>
                  <Text
                    fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
                    color={'white'}
                  >
                    {Number(depositedCollateral) / 1e18} stETH
                  </Text>
                  <Text
                    fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
                    color={'white'}
                  >
                    ~${CollateralUsdAmountOfUserStethEngine}
                  </Text>
                </VStack>
              </Flex>
              <HStack justifyContent={'flex-end'}>
                <Button
                  variant={'brandYellowFill'}
                  justifyContent={'flex-end'}
                  fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
                  onClick={() => {
                    router.push(`./borrow?token=${contracts.STETH.address}`);
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
                      `./borrow?token=${contracts.STETH.address}&isWithdraw=true`
                    );
                  }}
                >
                  Remove
                </Button>
              </HStack>
            </HStack>
            <Flex backgroundColor={''} mt={[0, 4, '1.003vw']}>
              <Text color={'white'}>
                Liquidation Price $ {LiquidationPriceForStethFixed}
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
                  {Number(userDepositedCollateral) / 1e18} stETH
                </Text>
              </HStack>

              <HStack justifyContent={'flex-end'} marginBottom={5}>
                <Text
                  color={'white'}
                  fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
                >
                  {SenUsdAmountOfUserStethEngine}
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

export default PositionViewSteth;
