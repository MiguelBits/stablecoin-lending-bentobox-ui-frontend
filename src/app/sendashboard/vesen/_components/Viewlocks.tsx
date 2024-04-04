import {
  Box,
  Button,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import {
  useAccount,
  useContractReads,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import React, { useState } from 'react';
import { formatUnits } from 'ethers';
import { useFormContext } from 'react-hook-form';

import TokenLogo from 'assets/logos/token-logo.svg';

import { useVesenContext } from '@/contexts/vesenContext';
import { useContractContext } from '@/contexts/contractContext';

// import vesenAbi from 'contracts/abi/vesenAbi.json';

export interface UserLockData {
  amount: string;
  start: number;
  renewal: boolean;
  endTimestamp: string;
  expirationEpoch: bigint;
  isExpired: bigint;
}

const ViewLocks = () => {
  const { address } = useAccount();
  const { userLockCount, refetchData, currentEpoch, epoch1Time } =
    useVesenContext();
  const currentLockCount = userLockCount ? Number(userLockCount.toString()) : 0;
  const { contracts } = useContractContext();
  const toast = useToast();
  const epoch1timeData = epoch1Time;

  // const ActualTime = Number(actualEpoch + epoch1timeData);
  // console.log('current', ActualTime)

  const {
    data: withdrawLockData,
    writeAsync: withdrawLock,
    isLoading: withdrawLockIsLoading,
  } = useContractWrite({
    ...contracts.VESEN,
    functionName: 'withdrawLock',
  });

  const { isLoading: withdrawLockTxIsLoading, refetch: refetchWithdrawLock } =
    useWaitForTransaction({
      hash: withdrawLockData?.hash,
      onSuccess: () => {
        refetchData();
        toast({
          title: 'Withdraw Successful',
          description: 'You have successfully withdrawed your lock.',
          isClosable: true,
          position: 'top-right',
          status: 'success',
          variant: 'success',
        });
      },
      onError: (err) => {
        console.group('DEPOSIT ERROR');
        console.error(['ERROR NAME:'], err.name);
        console.error(['ERROR CAUSE:'], err.cause);
        console.error(['ERROR MESSAGE:'], err.message);
        console.error(['ERROR STACK:'], err.stack);
        console.groupEnd();

        toast({
          title: 'Renewed Failed',
          description: 'Something went wrong.',
          isClosable: true,
          position: 'top-right',
          status: 'error',
          variant: 'error',
        });
      },
    });

  const {
    data: renewLockData,
    writeAsync: renewLock,
    isLoading: renewLockIsLoading,
  } = useContractWrite({
    ...contracts.VESEN,
    functionName: 'renewLock',
  });

  const { isLoading: renewLockTxIsLoading } = useWaitForTransaction({
    hash: renewLockData?.hash,
    onSuccess: () => {
      refetchData();
      toast({
        title: 'Renewed Successful',
        description: 'You have successfully renewed your lock.',
        isClosable: true,
        position: 'top-right',
        status: 'success',
        variant: 'success',
      });
    },
    onError: (err) => {
      console.group('DEPOSIT ERROR');
      console.error(['ERROR NAME:'], err.name);
      console.error(['ERROR CAUSE:'], err.cause);
      console.error(['ERROR MESSAGE:'], err.message);
      console.error(['ERROR STACK:'], err.stack);
      console.groupEnd();

      toast({
        title: 'Renewed Failed',
        description: 'Something went wrong.',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      });
    },
  });

  const handleWithdrawLock = async (index: number) => {
    try {
      await withdrawLock({
        args: [index],
      });
      console.log('Lock renewed successfully');
    } catch (error) {
      console.error('Error renewing lock:', error);
    }
  };

  const handleRenewLock = async (index: number) => {
    try {
      await renewLock({
        args: [index],
      });
      console.log('Lock renewed successfully');
    } catch (error) {
      console.error('Error renewing lock:', error);
    }
  };

  const useUserLockDataSync = (
    address: any,
    index: number
  ): UserLockData | null => {
    const { data: vesenContractData, refetch: refetchVesenContractData } =
      useContractReads({
        contracts: [
          {
            ...contracts.VESEN,
            functionName: 'getUserLock',
            args: [address, index],
          },
        ],
        select: (data) => {
          return data
            .filter((item) => {
              return item && item.result;
            })
            .map((item) => {
              return item.result;
            });
        },
      });

    if (vesenContractData && vesenContractData.length > 0) {
      const result = vesenContractData[0] as unknown[];
      if (result.length >= 3) {
        const startEpoch = Number(result[1]);
        const epochsPerLock = 16;
        const epochDuration = 600;
        const epoch1TimeNumber = 1691312400;
        const epoch1timeData = Number(epoch1Time);
        const actualEpoch = Number(currentEpoch);
        // const endEpoch = startEpoch + epochsPerLock;
        // const lockEndEpochTimestampInSeconds = epochDuration * endEpoch;

        const expirationTimestamp = BigInt(
          epoch1TimeNumber +
            startEpoch * epochDuration +
            epochsPerLock * epochDuration
        );

        const isTheExpirationTimeStampSuceed = BigInt(
          epoch1TimeNumber +
            actualEpoch * epochDuration +
            epochsPerLock * epochDuration
        );

        console.log('actual', isTheExpirationTimeStampSuceed);

        console.log('expired', expirationTimestamp);
        // console.log('endTimestamp:', expirationTimestamp);

        const expirationTimestampInSeconds =
          epoch1TimeNumber +
          startEpoch * epochDuration +
          epochsPerLock * epochDuration;

        const expirationDate = new Date(expirationTimestampInSeconds * 1000);

        const dateFormatter = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'UTC',
        });

        const formattedExpirationDate = dateFormatter.format(expirationDate);

        const expirationEpoch = startEpoch + epochsPerLock;

        return {
          amount: result[0] as string,
          start: startEpoch,
          renewal: result[2] as boolean,
          endTimestamp: formattedExpirationDate,
          expirationEpoch: expirationTimestamp,
          isExpired: isTheExpirationTimeStampSuceed,
        };
      }
    }

    return null;
  };

  const userLocksData: UserLockData[] = [];
  const vesenRenewal: UserLockData[] = [];

  if (address) {
    for (let index = 0; index < currentLockCount; index++) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const lockData = useUserLockDataSync(address, index);
      if (lockData) {
        userLocksData.push(lockData);
        vesenRenewal.push(lockData);
      }
    }
  }

  return (
    <Box
      maxH="500px"
      overflowY="auto"
      sx={{
        '&::-webkit-scrollbar': {
          width: '6px',
          right: '10px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(232, 185, 106, 0.5)',
          borderRadius: '3px',
        },
      }}
    >
      <Stack spacing={0}>
        {currentLockCount === 0 ? (
          <Text fontSize="md" color="white">
            You dont have any locks.
          </Text>
        ) : (
          userLocksData.map((lockData, index) => {
            const expirationTimestamp = new Date(
              lockData.endTimestamp
            ).getTime();
            const currentDate = new Date().getTime();
            const isExpired = lockData.expirationEpoch <= lockData.isExpired;

            return (
              Number(lockData.amount) > 0 && (
                <Stack
                  key={index}
                  spacing={0}
                  direction={['column', 'column', 'row']}
                  alignItems={['flex-start', 'flex-start', 'center']}
                  justifyContent={['center', 'center', 'space-between']}
                  py={[6, 6, '0.501vw']}
                  borderBottom="1px solid rgba(232, 185, 106, 0.12)"
                >
                  <VStack
                    alignItems={['flex-start', 'flex-start', 'center']}
                    spacing={3}
                  >
                    <HStack>
                      <Icon
                        as={TokenLogo}
                        w={[6, 6, '1vw']}
                        h={[6, 6, '1vw']}
                      />
                      <Text
                        fontSize={['md', 'md', '0.803vw']}
                        color="white"
                        marginLeft={0}
                      >
                        BPT Amount
                      </Text>
                    </HStack>
                    <Text
                      fontSize={['md', 'md', '1.003vw']}
                      color="white"
                      marginLeft={0}
                    >
                      {formatUnits(lockData.amount, 18) ?? 'Loading...'}
                    </Text>
                  </VStack>

                  <VStack
                    alignItems={['flex-start', 'flex-start', 'center']}
                    spacing={3}
                  >
                    <Text
                      fontSize={['md', 'md', '0.803vw']}
                      color="white"
                      marginLeft={0}
                    >
                      Expires On
                    </Text>
                    <Text
                      fontSize={['md', 'md', '1.003vw']}
                      color="white"
                      marginLeft={0}
                    >
                      {/* @ts-ignore temporaly */}
                      {lockData.endTimestamp ?? 'Loading...'}
                    </Text>
                  </VStack>

                  <HStack
                    justifyContent={['center', 'center', 'flex-end']}
                    spacing={3}
                  >
                    {isExpired && (
                      <Button
                        variant="brandYellowFill"
                        w={['100%', '100%', '100%', '100%']}
                        fontSize={['md', 'md', '0.778vw']}
                        style={{
                          textTransform: 'none',
                          textDecoration: 'none',
                        }}
                        fontStyle={'none'}
                        onClick={() => {
                          return handleRenewLock(index);
                        }}
                        isLoading={renewLockIsLoading || renewLockTxIsLoading}
                      >
                        Renew
                      </Button>
                    )}

                    <Button
                      color="white"
                      w={['100%', '100%', '100%', '100%']}
                      fontSize={['md', 'md', '0.778vw']}
                      border="1px solid rgba(232, 185, 106, 0.12)"
                      backgroundColor="rgba(232, 185, 106, 0.2)"
                      _hover={{ backgroundColor: 'rgba(232, 185, 106, 0.5)' }}
                      isDisabled={!isExpired}
                      onClick={() => {
                        return handleWithdrawLock(index);
                      }}
                      isLoading={
                        withdrawLockIsLoading || withdrawLockTxIsLoading
                      }
                    >
                      Claim
                    </Button>
                  </HStack>
                </Stack>
              )
            );
          })
        )}
      </Stack>
    </Box>
  );
};

export default ViewLocks;
