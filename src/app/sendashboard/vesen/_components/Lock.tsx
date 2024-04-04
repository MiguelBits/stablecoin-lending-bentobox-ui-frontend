import React, { useState } from 'react';
import {
  Button,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import InfoStat from 'components/InfoStat';

import TokenLogo from 'assets/logos/token-logo.svg';

import VeSenInfo from '@/components/vesen/RealTimeDisplay';
import { useVesenContext } from '@/contexts/vesenContext';

const Locker = () => {
  const { address: accountAddress } = useAccount();
  const {
    createLockFunction,
    vesenTokenAllowance,
    approveBPT,
    vesen2TokenBalance,
    isLoading: approveTxIsLoading,
    refetchData,
  } = useVesenContext();
  const [tokenAmount, setTokenAmount] = useState('');
  // console.log(vesen2TokenBalance);
  return (
    <Stack
      spacing={[3, 3, '0.752vw']}
      mt={[6, 6, '0.504vw']}
      position="relative"
      top="-1.5em"
    >
      <Text fontSize={['md', 'md', '1.003vw']} color="text.secondary">
        Amount to lock
      </Text>

      <InputGroup>
        <InputLeftElement width={[28, 28, '7.018vw']}>
          <HStack spacing={[2, 2, '0.501vw']}>
            <Icon as={TokenLogo} w={[6, 6, '1.504vw']} h={[6, 6, '1.504vw']} />
            <Text fontSize={['md', 'md', '1.003vw']} color="brand.secondary">
              {'BPT'}
            </Text>
          </HStack>
        </InputLeftElement>
        <Input
          pl={[32, 32, '8.020vw']}
          placeholder="0"
          value={tokenAmount}
          onChange={(e) => {
            return setTokenAmount(e.target.value);
          }}
          // {...register('tokenAmount')}
          color="text.secondary"
        />
      </InputGroup>
      <InfoStat
        tooltipLabel="Your earliest unlock date"
        label="Locked for 16 weeks."
        value={<VeSenInfo />}
        fontSize={['md', 'md', '1.003vw']}
      />
      <Stack
        mt={[4, 4, '0.1253vw']}
        direction={['column', 'column', 'row']}
        fontSize={['md', 'md', '1.003vw']}
      >
        {vesenTokenAllowance || 0 > 0 ? (
          <Button
            variant="brandYellowFill"
            w="full"
            type="button"
            onClick={() => {
              const amount = tokenAmount || '';
              if (createLockFunction) {
                return createLockFunction(Number(amount) * 1e18);
              }
            }}
          >
            LOCK BPT
          </Button>
        ) : (
          <Button
            variant="brandYellowFill"
            w="full"
            type="button"
            onClick={approveBPT}
            isLoading={approveTxIsLoading}
            isDisabled={!accountAddress}
          >
            APPROVE
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default Locker;
