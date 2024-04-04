'use client';
import {
  Box,
  Center,
  Heading,
  Text,
  Table,
  Tr,
  Thead,
  Th,
  CardBody,
  Card,
  useRadioGroup,
  Icon,
  Flex,
  VStack,
  HStack,
  As,
  Image,
  Button,
  Tbody,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useAccount, useContractRead, useContractReads } from 'wagmi';
import { useEffect, useState } from 'react';

import ArbitrumLogo from 'assets/logos/arbitrum.svg';
import EthereumLogo from 'assets/logos/ethereum.svg';
import AvalancheLogo from 'assets/logos/avalanche.svg';
import FantomLogo from 'assets/logos/fantom.svg';
import BinanceLogo from 'assets/logos/binance.svg';
import PolygonLogo from 'assets/logos/polygon.svg';
import OptimismLogo from 'assets/logos/optimism.svg';
import MoonriverLogo from 'assets/logos/moonriver.svg';

import TokenLogo from '/images/collateralTokens/weth.png';

import { BorrowProvider } from '@/contexts/borrowContext';
import { useContractContext } from '@/contexts/contractContext';
import CustomRadio from '@/components/CustomRadio';
import PositionViewWeth from 'app/sendashboard/positions/_components/PositionViewWeth';
import PositionViewSteth from 'app/sendashboard/positions/_components/PositionViewSteth';
import PositionViewRusdc from 'app/sendashboard/positions/_components/PositionViewRusdc';

interface PositionInfo {
  mintedAmount: string;
  liqPrice: string;
  collateralValueInUsd: string;
  debt: string;
  healthFactor: string;
}

const networkOptions = [
  // {
  //   icon: ArbitrumLogo,
  //   label: 'AETH',
  //   value: 'AETH',
  // },
  {
    icon: EthereumLogo,
    label: 'ETH',
    value: 'ETH',
  },
  // {
  //   icon: AvalancheLogo,
  //   label: 'AVAX',
  //   value: 'AVAX',
  // },
  // {
  //   icon: FantomLogo,
  //   label: 'FTM',
  //   value: 'FTM',
  // },
  // {
  //   icon: BinanceLogo,
  //   label: 'BSC',
  //   value: 'BSC',
  // },
  // {
  //   icon: PolygonLogo,
  //   label: 'MATIC',
  //   value: 'MATIC',
  // },
  // {
  //   icon: OptimismLogo,
  //   label: 'OP',
  //   value: 'OP',
  // },
  // {
  //   icon: MoonriverLogo,
  //   label: 'MOONRIVER',
  //   value: 'MOONRIVER',
  // },
];
const Positions = () => {
  const { address } = useAccount();
  const { contracts } = useContractContext();
  const [positionInfo, setPositionInfo] = useState<PositionInfo | null>(null); // Initialize positionInfo as null
  const [mintedAmount, setMintedAmount] = useState<string | null>(null);

  const networkOptions = [
    {
      icon: EthereumLogo,
      label: 'ETH',
      value: 'ETH',
    },
  ];

  const { getRadioProps: getNetworkRadioProps } = useRadioGroup({
    name: '0.25',
    defaultValue: '0.25',
    onChange: console.log,
  });

  const { data: userPositionInfoDataWeth } = useContractRead({
    ...contracts.WETH_ENGINE,
    functionName: 'getUserPositionInfo',
    args: [address as `0x${string}`],
  });

  const { data: userPositionInfoDataRusdc } = useContractRead({
    ...contracts.RUSDC_ENGINE,
    functionName: 'getUserPositionInfo',
    args: [address as `0x${string}`],
  });

  console.log('position data before', userPositionInfoDataWeth);

  const { data: userPositionInfoDataSteth } = useContractRead({
    ...contracts.STETH_ENGINE,
    functionName: 'getUserPositionInfo',
    args: [address as `0x${string}`],
  });

  console.log('position data before steth', userPositionInfoDataSteth);

  // // Define a state variable to store the user position data
  const [userPositionData, setUserPositionData] = useState<PositionInfo[]>([]);

  // When userPositionInfoData updates, update the state variable
  // useEffect(() => {
  //   if (userPositionInfoData && userPositionInfoData.length > 0) {
  //     const dataList = userPositionInfoData[0]?.map((item: any[]) => ({
  //       mintedAmount: item[0]?.toString(),
  //       liqPrice: item[1]?.toString(),
  //       collateralValueInUsd: item[2]?.toString(),
  //       debt: item[3]?.toString(),
  //       healthFactor: item[4]?.toString(),
  //       // Add other fields as needed
  //     })) || [];

  //     setUserPositionData(dataList);
  //   }
  // }, [userPositionInfoData ]);

  // console.log ('position data' , userPositionInfoData?.[0][0]  )

  // const userPositionInfoList = userPositionData.map((data, index) => (
  //   <div key={index}>
  //     <h2>User Position {index}</h2>
  //     <p>Minted Amount: {Number(userPositionInfoData?.[0][0])}</p>
  //     <p>Liquidation Price: {data.liqPrice}</p>
  //     <p>Collateral Value in USD: {data.collateralValueInUsd}</p>
  //     <p>Debt: {data.debt}</p>
  //     <p>Health Factor: {data.healthFactor}</p>
  //   </div>

  // ));

  // const userPositionInfoList2 = userPositionData.map((data, index) => (
  //   <Flex key={index}>
  //     <Text>
  //     {Number(data.mintedAmount)}
  //     </Text>
  //   </Flex>
  //  ));

  // console.log('Minted Amount:', userPositionInfoList2);
  const SenUsdAmountOfUserWethEngine =
    Number(userPositionInfoDataWeth?.[0] || 0) / 1e18;

  const SenUsdAmountOfUserStethEngine =
    Number(userPositionInfoDataSteth?.[0] || 0) / 1e18;

  const SenUsdAmountOfUserRusdcEngine =
    Number(userPositionInfoDataRusdc?.[0] || 0) / 1e18;

  const SenAmountOfUserMintedAllEngines =
    SenUsdAmountOfUserWethEngine +
    SenUsdAmountOfUserStethEngine +
    SenUsdAmountOfUserRusdcEngine;

  const CollateralUsdAmountOfUserWethEngine =
    Number(userPositionInfoDataWeth?.[2] || 0) / 1e18;

  const CollateralUsdAmountOfUserStethEngine =
    Number(userPositionInfoDataSteth?.[2] || 0) / 1e18;

  const CollateralUsdAmountOfUserRusdcEngine =
    Number(userPositionInfoDataRusdc?.[2] || 0) / 1e18;

  const CollateralAmountOfUserMintedAllEngines =
    CollateralUsdAmountOfUserWethEngine +
    CollateralUsdAmountOfUserStethEngine +
    CollateralUsdAmountOfUserRusdcEngine;

  return (
    <BorrowProvider>
      <VStack>
        <Center mb={[0, 4, '1.003vw']}>
          <Heading
            fontSize={['4xl', '5xl', '3.008vw']}
            letterSpacing={['-0.52px', '-0.52px', '-0.033vw']}
            textAlign="center"
            fontWeight="400"
          >
            <Text as="span" color="white" pr={[1, 1, '0.251vw']}>
              MY{' '}
            </Text>
            <Text as="span" fontStyle="italic" color="brand.secondary">
              POSITIONS
            </Text>
          </Heading>
        </Center>

        <Card
          width={['100%', '100%', '100%', '50%']}
          mb={[0, 4, '1.003vw']}
          rounded="3xl"
          background={'blackAlpha.500'}
        >
          <CardBody alignItems="">
            <Text color="white" mb={[0, 4, '1.003vw']}>
              Choose Chain
            </Text>
            <Flex
              gap={2}
              overflowX="auto"
              pb="0.5"
              sx={{
                '&::-webkit-scrollbar': {
                  height: '6px',
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'dash.tooltip',
                  width: '6px',
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
                    <HStack>
                      <Icon as={option.icon} />
                      <Text>{option.label}</Text>
                    </HStack>
                  </CustomRadio>
                );
              })}
            </Flex>
          </CardBody>
        </Card>
        <Card
          width={['100%', '100%', '100%', '50%']}
          rounded="3xl"
          background={'blackAlpha.500'}
        >
          <CardBody alignItems="">
            <HStack justifyContent="space-between" mb={[0, 4, '1.003vw']}>
              <Text color="white">Collateral Deposited</Text>
              <Text color="white" justifyContent="flex-end">
                $ {CollateralAmountOfUserMintedAllEngines}
              </Text>
            </HStack>

            <HStack justifyContent="space-between">
              <Text color="white">senUSD Borrowed</Text>
              <Text color="white" justifyContent="flex-end">
                $ {SenAmountOfUserMintedAllEngines}
              </Text>
            </HStack>
          </CardBody>
        </Card>
        <VStack width={['100%', '100%', '100%', '100%']}>
          <PositionViewWeth />
          <PositionViewSteth />
          <PositionViewRusdc />
        </VStack>
      </VStack>
    </BorrowProvider>
  );
};

export default dynamic(
  () => {
    return Promise.resolve(Positions);
  },
  { ssr: false }
);
