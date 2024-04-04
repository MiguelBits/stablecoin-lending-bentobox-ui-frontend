'use client';
import {
  Box,
  Center,
  Flex,
  HStack,
  Heading,
  Icon,
  Text,
} from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import DataTable from 'components/DataTable';
import DebouncedInput from 'components/DebouncedInput';

import { internalLinks } from 'constants/links';

import PlaceholderIcon from 'assets/logos/placeholder.svg';
import EthereumLogo from 'assets/logos/ethereum.svg';

type UnitConversion = {
  id: number;
  chain: string;
  pool: string;
  apr: string;
  tvl: string;
};

const data: UnitConversion[] = [
  {
    id: 1,
    chain: 'ETH',
    pool: 'yv-3Crypto',
    apr: '1.24M',
    tvl: '$ 2.22M',
  },
  {
    id: 2,
    chain: 'AVAX',
    pool: 'yv-3Crypto',
    apr: '1.24M',
    tvl: '$ 2.22M',
  },
  {
    id: 3,
    chain: 'AETH',
    pool: 'yv-3Crypto',
    apr: '1.24M',
    tvl: '$ 2.22M',
  },
];

const Farming = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [activeMarketFilter, setActiveMarketFilter] = useState('');
  const router = useRouter();

  const columnHelper = createColumnHelper<UnitConversion>();

  const columns = [
    columnHelper.accessor('chain', {
      cell: () => {
        return <Icon as={EthereumLogo} fontSize="lg" />;
      },
      header: 'Chain',
    }),
    columnHelper.accessor('pool', {
      cell: (info) => {
        return (
          <HStack>
            <Icon as={PlaceholderIcon} fontSize="lg" />
            <Text>{info.getValue()}</Text>
          </HStack>
        );
      },
      header: 'Pool',
    }),
    columnHelper.accessor('apr', {
      cell: (info) => {
        return info.getValue();
      },
      header: 'APR',
    }),
    columnHelper.accessor('tvl', {
      cell: (info) => {
        return info.getValue();
      },
      header: 'TVL',
    }),
    columnHelper.accessor('id', {
      cell: () => {
        return (
          <Box>
            <Text
              color="text.secondary"
              fontWeight="500"
              fontSize="sm"
              fontStyle="italic"
              cursor="pointer"
              textTransform="uppercase"
              transition="all 0.3s ease"
              _hover={{
                color: 'brand.secondary',
              }}
              onClick={() => {
                router.push(internalLinks.JOIN_FARMING);
              }}
            >
              Join Farm
            </Text>
          </Box>
        );
      },
      header: 'Actions',
    }),
  ];

  return (
    <Box>
      <Center mb={4}>
        <Heading
          fontSize="5xl"
          textAlign="center"
          fontWeight="400"
          color="white"
        >
          FARMING{' '}
          <Text as="span" color="brand.secondary">
            <Text as="i">OPPORTUNITIES</Text>
          </Text>
        </Heading>
      </Center>
      <Flex
        flexDirection={['column', 'column', 'row']}
        gap={4}
        alignItems="center"
        justifyContent={['space-around', 'flex-end']}
        w="full"
      >
        <Box flex={[1, 1, 1, 0.8]}>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => {
              return setGlobalFilter(String(value));
            }}
            placeholder="Search anything..."
            bg="background.primary"
            w="full"
            color="text.secondary"
          />
        </Box>
        <Box w={['full', 'full', 'auto']}>
          <DebouncedInput
            value={activeMarketFilter ?? ''}
            onChange={(value) => {
              return setActiveMarketFilter(String(value));
            }}
            placeholder="Active Markets Only..."
            bg="background.primary"
            w={['full', 'full', 'fit-content']}
            color="text.secondary"
          />
        </Box>
      </Flex>
      <DataTable
        columns={columns}
        data={data}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </Box>
  );
};

export default Farming;
