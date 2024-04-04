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

const PositionViewWeth = () => {
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

  const { data: userPositionInfoDataWeth } = useContractRead({
    ...contracts.WETH_ENGINE,
    functionName: 'getUserPositionInfo',
    args: [address as `0x${string}`],
  });

  const SenUsdAmountOfUserWethEngine =
    Number(userPositionInfoDataWeth?.[0] || 0) / 1e18;

  const CollateralUsdAmountOfUserWethEngine =
    Number(userPositionInfoDataWeth?.[2] || 0) / 1e18;

  const LiquidationPriceForWeth = Number(userPositionInfoDataWeth?.[1]) / 1e25;
  const LiquidationPriceForWethFixed = LiquidationPriceForWeth.toFixed(4);

  console.log('exact liquidation price', LiquidationPriceForWethFixed);

  return (
    <VStack width={['100%', '100%', '100%', '100%']}>
      <VStack mt={[0, 4, '1.003vw']}>
        <Text
          color="white"
          fontWeight={500}
          fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
        >
          INDIVIDUAL POSITIONS FOR WETH
        </Text>
      </VStack>
      {Number(depositedCollateral) > 0 ? (
        <Card
          width={['100%', '100%', '100%', '50%']}
          mb={[0, 4, '1.003vw']}
          rounded="3xl"
          background={'blackAlpha.500'}
        >
          <CardBody>
            <HStack>
              <Text color="white" mb={[0, 4, '1.003vw']}>
                WETH CHAMBER
              </Text>
            </HStack>
            <HStack>
              <Image
                src="/images/collateralTokens/weth.png"
                w={['8', '12', '14', '16']}
                h={['8', '12', '14', '16']}
              />

              <Flex w={'100%'} justifyContent={'flex-start'}>
                <VStack alignItems={'flex-start'}>
                  <Text
                    fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
                    color={'white'}
                  >
                    {Number(depositedCollateral) / 1e18} WETH
                  </Text>
                  <Text
                    fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
                    color={'white'}
                  >
                    ~${CollateralUsdAmountOfUserWethEngine}
                  </Text>
                </VStack>
              </Flex>
              <HStack justifyContent={'flex-end'}>
                <Button
                  variant={'brandYellowFill'}
                  justifyContent={'flex-end'}
                  fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
                  onClick={() => {
                    router.push(`./borrow?token=${contracts.WETH.address}`);
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
                      `./borrow?token=${contracts.WETH.address}&isWithdraw=true`
                    );
                  }}
                >
                  Remove
                </Button>
              </HStack>
            </HStack>
            <Flex backgroundColor={''} mt={[0, 4, '1.003vw']}>
              <Text color={'white'}>
                Liquidation Price $ {LiquidationPriceForWethFixed}
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
                  {Number(depositedCollateral) / 1e18} WETH
                </Text>
              </HStack>

              <HStack justifyContent={'flex-end'} marginBottom={5}>
                <Text
                  color={'white'}
                  fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
                >
                  {SenUsdAmountOfUserWethEngine}
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

export default PositionViewWeth;
