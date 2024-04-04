'use client';
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Heading,
  Icon,
  Switch,
  Text,
  theme,
  useBreakpointValue,
} from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContractRead } from 'wagmi';
import dynamic from 'next/dynamic';

import DataTable from 'components/DataTable';
import DebouncedInput from 'components/DebouncedInput';

import PlaceholderIcon from 'assets/logos/placeholder.svg';
import EthereumLogo from 'assets/logos/ethereum.svg';

import { BorrowProvider, useBorrowContext } from '@/contexts/borrowContext';
import { useContractContext } from '@/contexts/contractContext';
import registryAbi from 'contracts/abi/registryAbi.json';
import stableEngine from 'contracts/abi/stableEngine.json';

type UnitConversion = {
  id: number;
  chain: string;
  collateral: string;
  totalSenecaBorrowed: string;
  tvl: number;
  senecaLeftToBorrow: string;
  interest: string;
  address: string;
};

const Cauldrons = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [activeMarketFilter, setActiveMarketFilter] = useState(true);
  const router = useRouter();
  const { contracts } = useContractContext();

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
    refetchData,
  } = useBorrowContext();

  const columnHelper = createColumnHelper<UnitConversion>();

  const { data: tvlWethEngineData } = useContractRead({
    address: contracts?.REGISTRY.address,
    abi: registryAbi,
    functionName: 'getUSDValueForSpecificCollateral',
    args: [contracts?.WETH.address],
    enabled: !!contracts,
  });

  const { data: tvlStethEngineData } = useContractRead({
    address: contracts?.REGISTRY.address,
    abi: registryAbi,
    functionName: 'getUSDValueForSpecificCollateral',
    args: [contracts?.STETH.address],
    enabled: !!contracts,
  });

  const { data: tvlRusdcEngineData } = useContractRead({
    address: contracts?.REGISTRY.address,
    abi: registryAbi,
    functionName: 'getUSDValueForSpecificCollateral',
    args: [contracts?.RUSDC.address],
    enabled: !!contracts,
  });

  const { data: WethInterest } = useContractRead({
    address: contracts?.WETH_ENGINE.address,
    abi: stableEngine,
    functionName: 'INTEREST_RATE',
  });

  const { data: StethInterest } = useContractRead({
    address: contracts?.STETH_ENGINE.address,
    abi: stableEngine,
    functionName: 'INTEREST_RATE',
  });
  const { data: rUSDCInterest } = useContractRead({
    address: contracts?.RUSDC_ENGINE.address,
    abi: stableEngine,
    functionName: 'INTEREST_RATE',
  });
  const { data: WethUSDBorrowed } = useContractRead({
    address: contracts?.WETH_ENGINE.address,
    abi: stableEngine,
    functionName: 'vaultMintedAmount',
  });
  const { data: StETHUSDBorrowed } = useContractRead({
    address: contracts?.STETH_ENGINE.address,
    abi: stableEngine,
    functionName: 'vaultMintedAmount',
  });

  const { data: rUsdcUSDBorrowed } = useContractRead({
    address: contracts?.RUSDC_ENGINE.address,
    abi: stableEngine,
    functionName: 'vaultMintedAmount',
  });

  const { data: WethMintCap } = useContractRead({
    address: contracts?.WETH_ENGINE.address,
    abi: stableEngine,
    functionName: 'vaultMintCap',
  });
  const { data: rUSDCMintCap } = useContractRead({
    address: contracts?.RUSDC_ENGINE.address,
    abi: stableEngine,
    functionName: 'vaultMintCap',
  });
  const { data: StethMintCap } = useContractRead({
    address: contracts?.STETH_ENGINE.address,
    abi: stableEngine,
    functionName: 'vaultMintCap',
  });

  const WethEngineInterest = Number(WethInterest) / 1e27;
  const StethEngineInterest = Number(StethInterest) / 1e27;
  const rUSDCEngineInterest = Number(rUSDCInterest) / 1e27;
  const senMintCapWeth = Number(WethMintCap) / 1e18;
  const senMintCapSteth = Number(StethMintCap) / 1e18;
  const senMintCapSrUSDC = Number(rUSDCMintCap) / 1e18;
  const senUSDBorrowedWeth = Number(Number(WethUSDBorrowed) / 1e18).toFixed(2);
  const senUSDBorrowedSteth = Number(Number(StETHUSDBorrowed) / 1e18).toFixed(
    2
  );
  const senUSDBorrowedrUSDC = Number(Number(rUsdcUSDBorrowed) / 1e18).toFixed(
    2
  );
  const senLeftToBorrowWeth = Number(
    senMintCapWeth - Number(senUSDBorrowedWeth)
  );
  const senLeftToBorrowSteth = Number(
    senMintCapSteth - Number(senUSDBorrowedSteth)
  );
  const senLeftToBorrowSrUSDC = Number(
    senMintCapSrUSDC - Number(senUSDBorrowedrUSDC)
  );
  const formattedTvlWeth = `${Number(Number(tvlWethEngineData) / 1e18).toFixed(
    2
  )}`;
  const formattedTVLSteth = `${Number(
    Number(tvlStethEngineData) / 1e18
  ).toFixed(2)}`;
  const formattedTvlRusdc = `${Number(
    Number(tvlRusdcEngineData) / 1e18
  ).toFixed(2)}`;

  const data: UnitConversion[] = [
    {
      id: 1,
      chain: 'GOERLI',
      collateral: 'WETH',
      totalSenecaBorrowed: String(senUSDBorrowedWeth),
      tvl: Number(formattedTvlWeth),
      senecaLeftToBorrow: String(senLeftToBorrowWeth),
      interest: `${WethEngineInterest}%`,
      address: '0x35b8907F073cd1a632c3C170c30951dDbFEE3c00',
    },
    {
      id: 2,
      chain: 'GOERLI',
      collateral: 'STETH',
      totalSenecaBorrowed: String(senUSDBorrowedSteth),
      tvl: Number(formattedTVLSteth),
      senecaLeftToBorrow: String(senLeftToBorrowSteth),
      interest: `${StethEngineInterest}%`,
      address: '0xd52F896211b1d3F29edE383CeB27d8e27cC60711',
    },
    {
      id: 3,
      chain: 'GOERLI',
      collateral: 'rUSDC',
      totalSenecaBorrowed: String(senUSDBorrowedrUSDC),
      tvl: Number(formattedTvlRusdc),
      senecaLeftToBorrow: String(senLeftToBorrowSrUSDC),
      interest: `${rUSDCEngineInterest}%`,
      address: '0x977dFa56259bF808c2c522d6B33F9B7865EAb7Ba',
    },
  ];

  const buttonSize = useBreakpointValue({ base: 'sm', sm: 'md' });

  const columns = [
    columnHelper.accessor('chain', {
      cell: () => {
        return <Icon as={EthereumLogo} fontSize={['md', 'lg', 'xl']} />;
      },
      header: () => {
        return <Text fontSize={['sm', 'lg', 'lg']}>Chain</Text>;
      },
    }),
    columnHelper.accessor('collateral', {
      cell: (info) => {
        return (
          <HStack>
            <Icon as={PlaceholderIcon} fontSize={['md', 'lg', '2xl']} />
            <Text>{info.getValue()}</Text>
          </HStack>
        );
      },
      header: () => {
        return <Text fontSize={['md', 'lg', 'lg']}>Collateral</Text>;
      },
    }),
    columnHelper.accessor('totalSenecaBorrowed', {
      cell: (info) => {
        return info.getValue();
      },
      header: () => {
        return (
          <Text fontSize={['md', 'lg', 'lg']} textTransform={'none'}>
            Total senUSD Borrowed
          </Text>
        );
      },
    }),
    columnHelper.accessor('tvl', {
      cell: (info) => {
        return `$${info.getValue()}`;
      },

      header: () => {
        return <Text fontSize={['md', 'lg', 'lg']}>TVL</Text>;
      },
    }),
    columnHelper.accessor('senecaLeftToBorrow', {
      cell: (info) => {
        return info.getValue();
      },
      header: () => {
        return (
          <Text fontSize={['md', 'lg', 'lg']} textTransform={'none'}>
            senUSD Left To Borrow
          </Text>
        );
      },
    }),
    columnHelper.accessor('interest', {
      cell: (info) => {
        return info.getValue();
      },
      header: () => {
        return <Text fontSize={['md', 'lg', 'lg']}>Interest</Text>;
      },
    }),

    columnHelper.accessor('address', {
      cell: (info) => {
        return (
          <BorrowProvider>
            <HStack direction={['column', 'column', 'column', 'row', 'row']}>
              <Button
                size={['sm', 'md', 'md', 'md']}
                variant="brandYellowFill"
                onClick={() => {
                  router.push(`./borrow?token=${info.getValue()}`);
                }}
              >
                Borrow
              </Button>
              <Button
                variant="brandYellowFill"
                size={['sm', 'md', 'sm', 'md']}
                isDisabled={true}
              >
                LEVERAGE
              </Button>
            </HStack>
          </BorrowProvider>
        );
      },
      header: () => {
        // return <Text fontSize={['sm', 'lg', 'lg']}></Text>;
      },
    }),
  ];

  return (
    <BorrowProvider>
      <Box>
        <Center mb={[0, 4, '1.003vw']}>
          <Heading
            fontSize={['4xl', '5xl', '2xl', '3.008vw']}
            letterSpacing={['-0.52px', '-0.52px', '-0.033vw']}
            textAlign="center"
            fontWeight="400"
          >
            <Text as="span" color="white" pr={[3, 3, '0.752vw']}>
              AVAILABLE{' '}
            </Text>
            <Text as="span" fontStyle="italic" color="brand.secondary">
              CHAMBERS
            </Text>
          </Heading>
        </Center>
        <Flex
          gap={[4, 4, '1.003vw']}
          flexDirection={['column', 'column', 'row']}
          alignItems="center"
          justifyContent="space-between"
          w="full"
          mb={[2, 2, '0.501vw']}
        >
          <Box w={['full', 'full', 'sm']}>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={(value) => {
                return setGlobalFilter(String(value));
              }}
              placeholder="Search anything..."
              bg="background.primary"
              w={['full', 'full', 'full', '20.050vw']}
              fontSize={['md', 'lg', 'lg']}
              textColor={'text.white'}
            />
          </Box>
          <HStack w={['full', 'full', 'auto']} spacing={[6, 6, '0.667vw']}>
            <Text fontSize={['sm', 'sm', 'md']} color={'text.secondary'}>
              Active Markets Only
            </Text>
            <Switch
              // value={activeMarketFilter ?? ''}
              // onChange={(value) => {
              //   return setActiveMarketFilter(String(value));
              // }}
              placeholder="Active Markets Only"
              w={['full', 'full', 'fit-content']}
              fontSize={'lg'}
              isChecked={activeMarketFilter}
              onChange={() => {
                return setActiveMarketFilter(!activeMarketFilter);
              }}
              colorScheme="yellow"
            />
          </HStack>
        </Flex>
        <DataTable
          columns={columns}
          data={data}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </Box>
    </BorrowProvider>
  );
};

export default dynamic(
  () => {
    return Promise.resolve(Cauldrons);
  },
  { ssr: false }
);
