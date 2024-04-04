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
  Flex,
  Box,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useAccount, useContractRead } from 'wagmi';
import React, { ChangeEvent, useState } from 'react';

import TokenLogo from 'assets/logos/token-logo.svg';

import { useContractContext } from '@/contexts/contractContext';
import { useSenStakingContext } from '@/contexts/senStakingContext';

const StakeToken = () => {
  const { address } = useAccount();
  const { contracts } = useContractContext();
  const {
    senTokenAllowance,
    stakeFunction,
    approveSEN,
    senTokenBalance,
    isLoading: approveIsLoading,
    isLoading: approveIsLoadingTxIsLoading,
    isLoading: stakeIsLoading,
    isLoading: stakeTxIsLoading,
  } = useSenStakingContext();
  const [tokenAmount, setTokenAmount] = useState('');

  const { data: conversionToAssets } = useContractRead({
    ...contracts.SSEN,
    functionName: 'convertToAssets',
    args: [Number(tokenAmount) * 1e18],
  });

  const { data: sSenRatio } = useContractRead({
    ...contracts.SSEN,
    functionName: 'previewDeposit',
    args: [Number(tokenAmount) * 1e18],
  });

  console.log('conversion', conversionToAssets);
  console.log('preview deposit', sSenRatio);

  const ratioCalculation = Number(sSenRatio) / 1e18;
  const reedemAmount = Number(tokenAmount) * Number(ratioCalculation);

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
              Stake
            </Text>
            <HStack alignContent={'flex-end'}>
              <Text fontSize={['md', 'md', 'lg']} color="text.secondary">
                Balance:
              </Text>
              <Text fontSize={['md', 'md', 'lg']} color="brand.secondary">
                {Number(senTokenBalance?.formatted).toFixed(6)} SEN
              </Text>
            </HStack>
          </HStack>

          <InputGroup>
            <InputLeftElement
              width={[28, 28, '7.018vw']}
              py={[0, '0rem', '0.950rem', 0, 0]}
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
                  SEN
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
                    senTokenBalance?.formatted ?? ''
                  );
                  if (!isNaN(convertedAmount)) {
                    const decimalPlaces = senTokenBalance?.decimals ?? 18; // Replace with the actual number of decimals if available
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
              You are redeeming: {reedemAmount.toFixed(4)} sSEN{' '}
            </Text>
          )} */}
          <Stack
            mt={[4, 4, '1.1253vw']}
            direction={['column', 'column', 'row']}
            fontSize={['md', 'md', '1.003vw']}
          >
            {senTokenAllowance || 0 > 0 ? (
              <Button
                size={['md', 'sm', 'xs', 'md']}
                variant="brandYellowFill"
                w="full"
                type="button"
                onClick={() => {
                  if (stakeFunction) {
                    const amount = tokenAmount;
                    console.log('before pressing button', amount);
                    stakeFunction(Number(amount) * 1e18);
                  }
                }}
                isLoading={stakeIsLoading || stakeTxIsLoading}
              >
                Stake
              </Button>
            ) : (
              <Button
                variant="brandYellowFill"
                w="full"
                size={['md', 'sm', 'xs', 'md']}
                type="button"
                onClick={approveSEN}
                isLoading={approveIsLoading || approveIsLoadingTxIsLoading}
                isDisabled={!address}
              >
                APPROVE
              </Button>
            )}
          </Stack>
          <VStack>
            <Text
              fontSize={['md', 'md', 'lg']}
              color="text.secondary"
              fontStyle={'italic'}
            >
              Earn from Seneca! Stake your SEN to get sSEN. There is no lockup
              and no deposit tax.
            </Text>
            <Text
              fontSize={['md', 'md', 'lg']}
              color="text.secondary"
              fontStyle={'italic'}
            >
              Withdraw at any time. sSEN grows from protocol revenues, and it’s
              continuously compounding.
            </Text>
          </VStack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default StakeToken;
