'use client';
import {
  Box,
  Card,
  Center,
  Container,
  Flex,
  FormControl,
  HStack,
  Heading,
  Icon,
  Stack,
  Text,
  useRadioGroup,
} from '@chakra-ui/react';

import CustomRadio from 'components/CustomRadio';

import ArbitrumLogo from 'assets/logos/arbitrum.svg';
import EthereumLogo from 'assets/logos/ethereum.svg';
import AvalancheLogo from 'assets/logos/avalanche.svg';
import FantomLogo from 'assets/logos/fantom.svg';
import BinanceLogo from 'assets/logos/binance.svg';
import PolygonLogo from 'assets/logos/polygon.svg';
import OptimismLogo from 'assets/logos/optimism.svg';
import MoonriverLogo from 'assets/logos/moonriver.svg';

import FormTabs from 'app/sendashboard/farmingoutofsync/_components/FormTabs';

const networkOptions = [
  {
    icon: ArbitrumLogo,
    label: 'AETH',
    value: 'AETH',
  },
  {
    icon: EthereumLogo,
    label: 'ETH',
    value: 'ETH',
  },
  {
    icon: AvalancheLogo,
    label: 'AVAX',
    value: 'AVAX',
  },
  {
    icon: FantomLogo,
    label: 'FTM',
    value: 'FTM',
  },
  {
    icon: BinanceLogo,
    label: 'BSC',
    value: 'BSC',
  },
  {
    icon: PolygonLogo,
    label: 'MATIC',
    value: 'MATIC',
  },
  {
    icon: OptimismLogo,
    label: 'OP',
    value: 'OP',
  },
  {
    icon: MoonriverLogo,
    label: 'MOONRIVER',
    value: 'MOONRIVER',
  },
];

const JoinFarm = () => {
  const { getRadioProps: getNetworkRadioProps } = useRadioGroup({
    name: '0.25',
    defaultValue: '0.25',
    onChange: console.log,
  });
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
      <Container px={0} overflow="hidden">
        <Card px="8" py="6">
          <Stack spacing={6}>
            <FormControl>
              <Box
                border="1px solid rgba(232, 185, 106, 0.12)"
                py="1"
                px="2"
                borderRadius="md"
              >
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
              </Box>
            </FormControl>
            <FormTabs />
          </Stack>
        </Card>
      </Container>
    </Box>
  );
};

export default JoinFarm;
