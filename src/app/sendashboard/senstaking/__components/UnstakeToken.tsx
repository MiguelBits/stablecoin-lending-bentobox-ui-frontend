import {
  Button,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
  VStack,
  Card,
  CardBody,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
} from 'wagmi';
import React, { ChangeEvent, useState } from 'react';
import BigNumber from 'bignumber.js';

import TokenLogo from 'assets/logos/token-logo.svg';

import { useContractContext } from '@/contexts/contractContext';
import { useSenStakingContext } from '@/contexts/senStakingContext';

const UnstakeToken = () => {
  const { address } = useAccount();
  const { contracts } = useContractContext();

  const { sSenTokenAllowance, sSenTokenBalance, unstakeFunction, approveSSEN } =
    useSenStakingContext();

  const [tokenAmount, setTokenAmount] = useState('');

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
    args: [Number(tokenAmount) * 1e18],
  });

  const { data: conversionToShares } = useContractRead({
    ...contracts.SSEN,
    functionName: 'convertToShares',
    args: [Number(tokenAmount) * 1e18],
  });

  const { data: maxRedeem } = useContractRead({
    ...contracts.SSEN,
    functionName: 'maxRedeem',
    args: [address],
  });

  // Convert maxRedeem to BigInt
  const maxRedeemAmount =
    maxRedeem !== undefined ? BigInt(maxRedeem.toString()) : BigInt(0);

  // Convert previewReedem to BigInt
  const previewReedemAmount = BigInt(maxRedeemAmount.toString());

  console.log('max amount', previewReedemAmount);

  const formattedMaxAmount = previewReedemAmount / BigInt(1e18);

  console.log('result amount', formattedMaxAmount);

  const reedemAmount = Number(previewReedem) / 1e18;

  console.log('conversion', conversionToShares);

  const phoneInputStyles = useBreakpointValue({
    base: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
    sm: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      maxWidth: 'calc(100% - 60px)',
    },
    md: {
      // overflow: 'hidden',
      // whiteSpace: 'nowrap',
      // maxWidth: 'calc(100% - 60px)',
    },
    lg: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      maxWidth: 'calc(100% - 60px)',
    },
  });

  return (
    <Card width={'100%'}>
      <CardBody>
        <Stack
          spacing={[3, 3, '0.752vw']}
          mt={[6, 6, '0.504vw']}
          position="relative"
        >
          <HStack justifyContent="space-between">
            <Text fontSize={['md', 'md', 'lg']} color="text.secondary">
              Unstake
            </Text>
            <HStack alignContent={'flex-end'}>
              <Text fontSize={['md', 'md', 'lg']} color="text.secondary">
                Balance:
              </Text>
              <Text fontSize={['md', 'md', 'lg']} color="brand.secondary">
                {Number(sSenTokenBalance?.formatted).toFixed(6)} sSEN
              </Text>
            </HStack>
          </HStack>

          <InputGroup>
            <InputLeftElement
              width={[28, 28, '7.018vw']}
              py={[0, '0rem', '0.950rem', 0, 0]}
              minH={['', '', '2rem', '2.300rem', '0']}
            >
              <HStack spacing={[2, 2, '0.501vw']} height={[28, 28, '7.018vw']}>
                <Icon
                  as={TokenLogo}
                  w={[6, 6, '1.504vw']}
                  h={[6, 6, '1.504vw']}
                />
                <Text
                  fontSize={['md', 'md', 'md', 'lg']}
                  color="brand.secondary"
                >
                  sSEN
                </Text>
              </HStack>
            </InputLeftElement>
            <Input
              fontSize={['lg', 'lg', 'xl']}
              pl={[32, 32, '8.020vw']}
              placeholder="0"
              // readOnly
              color="white"
              value={tokenAmount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const inputValue = e.target.value;
                const numericValue = inputValue.replace(/[^0-9.]/g, '');
                setTokenAmount(numericValue);
              }}
              onInput={(e: ChangeEvent<HTMLInputElement>) => {
                e.target.value = e.target.value.replace(/[^0-9.]/g, '');
              }}
              sx={phoneInputStyles}
              minH={['', '', '2rem', '2.300rem', '0']}
            />
            <InputRightElement>
              <Button
                size={['sm', 'md', 'sm', 'md']}
                variant="brandYellowFill"
                h={['2rem', '2rem', 'auto']}
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={() => {
                  const convertedAmount = parseFloat(
                    sSenTokenBalance?.formatted ?? ''
                  );
                  if (!isNaN(convertedAmount)) {
                    const decimalPlaces = sSenTokenBalance?.decimals ?? 18;
                    const formattedAmount =
                      convertedAmount.toFixed(decimalPlaces);
                    setTokenAmount(formattedAmount);
                  }
                }}
              >
                Max
              </Button>
            </InputRightElement>
          </InputGroup>
          {/* {tokenAmount && (
            <Text color={'text.secondary'}>
              {' '}
              You are redeeming: {reedemAmount.toFixed(5)} SEN{' '}
            </Text>
          )} */}
          <Stack
            mt={[4, 4, '1.1253vw']}
            direction={['column', 'column', 'row']}
            fontSize={['md', 'md', '1.003vw']}
          >
            {sSenTokenAllowance || 0 > 0 ? (
              <Button
                size={['md', 'sm', 'xs', 'md']}
                variant="brandYellowFill"
                w="full"
                type="button"
                onClick={() => {
                  const amount = tokenAmount || '';
                  const amountBigInt = BigInt(
                    Math.floor(parseFloat(amount) * 1e18)
                  );
                  if (unstakeFunction) {
                    return unstakeFunction(Number(amountBigInt));
                  }
                }}
              >
                Unstake
              </Button>
            ) : (
              <Button
                variant="brandYellowFill"
                w="full"
                size={['md', 'sm', 'xs', 'md']}
                type="button"
                onClick={approveSSEN}
                // isLoading={approveTxIsLoading}
                isDisabled={!address}
              >
                APPROVE
              </Button>
            )}
          </Stack>
          <HStack alignItems={'flex-start'}>
            <Text
              fontSize={['md', 'md', 'lg']}
              color="brand.secondary"
              fontStyle={'italic'}
            >
              Withdrawn Amount
            </Text>
            <Text
              fontSize={['md', 'md', 'lg']}
              color="text.secondary"
              fontStyle={'italic'}
            >
              {tokenAmount && (
                <Text color={'text.secondary'}>
                  {' '}
                  ~{reedemAmount.toFixed(5)} SEN{' '}
                </Text>
              )}
            </Text>
          </HStack>
          {/* <HStack>
            <Text
              fontSize={['md', 'md', '1.003vw']}
              color="brand.secondary"
              fontStyle={'italic'}
            >
              Withdraw Release Time
            </Text>

            <Text
              fontSize={['md', 'md', '1.003vw']}
              color="text.secondary"
              fontStyle={'italic'}
            >
              N/A
            </Text>
          </HStack> */}
          <VStack>
            {/* <Text
              fontSize={['md', 'md', '1.003vw']}
              color="text.secondary"
              fontStyle={'italic'}
            >
              There is a 7-day delay after unstaking your SEN until withdrawal
              is available.
            </Text>
            <Text
              fontSize={['md', 'md', '1.003vw']}
              color="text.secondary"
              fontStyle={'italic'}
            >
              After the 7-day delay period, you will need to manually withdraw
              your SEN.
            </Text> */}
          </VStack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default UnstakeToken;
