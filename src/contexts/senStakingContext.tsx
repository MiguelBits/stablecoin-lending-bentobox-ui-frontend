import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useContractReads,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { useToast } from '@chakra-ui/react';
import { MaxUint256 } from 'ethers';
import { readContract } from '@wagmi/core';

import useVesen from 'hooks/useVesen';

import { VesenToken } from 'models/lockToken';
import { Balance } from 'models/web3';

import { useContractContext } from 'contexts/contractContext';

import registryAbi from 'contracts/abi/registryAbi.json';
import rewardsDistributor from 'contracts/abi/rewardsDistributor.json';

interface SenStakingProviderProps {
  children: React.ReactNode;
}
interface SenStakingContextProps {
  senTokenBalance?: Balance;
  sSenTokenBalance?: Balance;
  senTokenAllowance?: bigint;
  sSenTokenAllowance?: bigint;
  collateralUsdValue: number;
  readClaimableVesenRewards?: bigint;
  isLoading?: boolean;
  stakeFunction?: (amount: number) => Promise<void>;
  unstakeFunction?: (amount: number) => Promise<void>;
  claimVesenRewards?: () => Promise<void>;
  refetchData: () => void;
  approveSEN: () => Promise<void>;
  approveSSEN: () => Promise<void>;
}

export const SenStakingContext = createContext<SenStakingContextProps>({
  collateralUsdValue: 0,
  readClaimableVesenRewards: undefined,

  stakeFunction: async () => {
    return;
  },

  unstakeFunction: async () => {
    return;
  },

  claimVesenRewards: async () => {
    return;
  },

  isLoading: false,

  approveSEN: async () => {
    return;
  },

  approveSSEN: async () => {
    return;
  },

  refetchData: () => {
    return;
  },
});

export const SenStakingProvider: React.FC<SenStakingProviderProps> = ({
  children,
}) => {
  const toast = useToast();
  const { address } = useAccount();
  const { contracts } = useContractContext();

  // ORACLE

  const collateralUsdValue = readContract({
    ...contracts.ORACLE,
    functionName: 'getAmountPriced',
    args: [10, contracts.WETH?.address],
  });

  // BALANCES

  const { data: senTokenBalance, refetch: refetchSenTokenBalance } = useBalance(
    {
      address,
      token: contracts.SEN.address,
      enabled: !!contracts && !!address,
    }
  );

  const { data: sSenTokenBalance, refetch: refetchSsenTokenBalance } =
    useBalance({
      address,
      token: contracts.SSEN?.address,
      enabled: !!contracts && !!address,
    });

  // ALLOWANCES

  const { data: sSenTokenAllowance, refetch: refetchSSENAllowance } =
    useContractRead({
      address: contracts.SSEN?.address,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [address as `0x${string}`, contracts.SEN?.address],
      enabled: !!address && !!contracts,
    });

  const { data: senTokenAllowance, refetch: refetchsenAllowance } =
    useContractRead({
      address: contracts.SEN?.address,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [address as `0x${string}`, contracts.SSEN?.address],
      enabled: !!address && !!contracts,
    });

  // APPROVE

  const {
    data: approveData,
    writeAsync: approve,
    isLoading: approveIsLoading,
  } = useContractWrite({
    ...contracts.SEN,
    functionName: 'approve',
    onSuccess: () => {
      refetchData();
    },
    onError: (err) => {
      console.group('APPROVE ERROR');
      console.error(['ERROR NAME:'], err.name);
      console.error(['ERROR CAUSE:'], err.cause);
      console.error(['ERROR MESSAGE:'], err.message);
      console.error(['ERROR STACK:'], err.stack);
      console.groupEnd();
    },
  });

  const { isLoading: approveIsLoadingTxIsLoading } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: () => {
      refetchData();
      toast({
        title: 'Approved Successful',
        description: 'You have successfully approved your token.',
        isClosable: true,
        position: 'top-right',
        status: 'success',
        variant: 'success',
      });
    },
    onError: (err) => {
      console.group('APPROVE ERROR');
      console.error(['ERROR NAME:'], err.name);
      console.error(['ERROR CAUSE:'], err.cause);
      console.error(['ERROR MESSAGE:'], err.message);
      console.error(['ERROR STACK:'], err.stack);
      console.groupEnd();

      toast({
        title: 'Approved Failed',
        description: 'Something went wrong try approving again.',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      });
      refetchData();
    },
  });

  const approveSEN = async () => {
    await approve({
      args: [contracts.SSEN?.address, MaxUint256],
    });
    refetchData();
  };

  const {
    data: approveSSENData,
    writeAsync: approve2,
    isLoading: approveSSENIsLoading,
  } = useContractWrite({
    ...contracts.SSEN,
    functionName: 'approve',
    onError: (err) => {
      console.group('APPROVE ERROR');
      console.error(['ERROR NAME:'], err.name);
      console.error(['ERROR CAUSE:'], err.cause);
      console.error(['ERROR MESSAGE:'], err.message);
      console.error(['ERROR STACK:'], err.stack);
      console.groupEnd();
    },
  });

  const { isLoading: approveSSENIsLoadingTxIsLoading } = useWaitForTransaction({
    hash: approveSSENData?.hash,
    onSuccess: () => {
      refetchData();
      toast({
        title: 'Approved Successful',
        description: 'You have successfully approved your  token.',
        isClosable: true,
        position: 'top-right',
        status: 'success',
        variant: 'success',
      });
    },
    onError: (err) => {
      console.group('APPROVE ERROR');
      console.error(['ERROR NAME:'], err.name);
      console.error(['ERROR CAUSE:'], err.cause);
      console.error(['ERROR MESSAGE:'], err.message);
      console.error(['ERROR STACK:'], err.stack);
      console.groupEnd();

      toast({
        title: 'Approved Failed',
        description: 'Something went wrong try approving again.',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      });
      refetchData();
    },
  });

  const approveSSEN = async () => {
    await approve2({
      args: [contracts.SEN?.address, MaxUint256],
    });
    refetchData();
  };

  //STAKE

  const {
    writeAsync: stake,
    isLoading: stakeIsLoading,
    data: stakeData,
  } = useContractWrite({
    ...contracts.SSEN,
    functionName: 'deposit',
    onError: (err) => {
      console.group('CREATE STAKE ERROR');
      console.error(['ERROR NAME:'], err.name);
      console.error(['ERROR CAUSE:'], err.cause);
      console.error(['ERROR MESSAGE:'], err.message);
      console.error(['ERROR STACK:'], err.stack);
      console.groupEnd();

      toast({
        title: 'Staking Tokens Failed',
        description: 'Something went wrong! Please try again later.',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      });
    },
  });

  const { isLoading: stakeTxIsLoading } = useWaitForTransaction({
    hash: stakeData?.hash,
    onSuccess: () => {
      refetchData();
      toast({
        title: 'Stake Created',
        description: 'Your stake has been created successfully.',
        isClosable: true,
        position: 'top-right',
        status: 'success',
        variant: 'success',
      });
    },
  });

  const stakeFunction = async (amount: number) => {
    try {
      await stake({
        args: [amount, address],
      });
    } catch (error) {
      console.error('Error creating deposit', error);
    }
  };

  const {
    writeAsync: unstake,
    //eslint-disable-next-line
    isLoading: unstakeIsLoading,
    data: unsstakeData,
  } = useContractWrite({
    ...contracts.SSEN,
    functionName: 'redeem',
    onError: (err) => {
      console.group('WITHDRAW ERROR');
      console.error(['ERROR NAME:'], err.name);
      console.error(['ERROR CAUSE:'], err.cause);
      console.error(['ERROR MESSAGE:'], err.message);
      console.error(['ERROR STACK:'], err.stack);
      console.groupEnd();

      toast({
        title: 'Withdraw Tokens Failed',
        description: 'Something went wrong! Please try again later.',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      });
    },
  });

  const {
    //eslint-disable-next-line
    isLoading: unsstakeTxIsLoading,
  } = useWaitForTransaction({
    hash: unsstakeData?.hash,
    onSuccess: () => {
      refetchData();
      toast({
        title: 'Withdraw Successful',
        description: 'Your have withdrawed your tokens successfully.',
        isClosable: true,
        position: 'top-right',
        status: 'success',
        variant: 'success',
      });
    },
  });

  const unstakeFunction = async (amount: number) => {
    try {
      await unstake({
        args: [amount, address, address],
      });
    } catch (error) {
      console.error('Error withdrawing', error);
    }
  };

  //console.log('lockers', lockers);
  //console.log('userLock', userLocks);
  // useEffect(() => {
  //   if (vesenTokens && vesenTokens.length > 0) {
  //     setActiveVesenToken(vesenTokens[0]);
  //   }
  // }, [vesenTokens]);

  const refetchData = async () => {
    Promise.all([
      refetchSsenTokenBalance(),
      refetchSenTokenBalance(),
      refetchsenAllowance(),
      refetchSSENAllowance(),
    ]);
  };

  //console.log('userLocks ', userLocks);
  return (
    <SenStakingContext.Provider
      value={{
        collateralUsdValue: Number(collateralUsdValue) || 0,
        senTokenBalance,
        sSenTokenBalance,
        senTokenAllowance,
        sSenTokenAllowance,
        isLoading:
          approveIsLoading ||
          approveIsLoadingTxIsLoading ||
          approveSSENIsLoading ||
          approveSSENIsLoadingTxIsLoading ||
          stakeIsLoading ||
          stakeTxIsLoading,
        approveSEN,
        approveSSEN,
        stakeFunction,
        unstakeFunction,
        refetchData,
      }}
    >
      {children}
    </SenStakingContext.Provider>
  );
};

export const useSenStakingContext = () => {
  return useContext(SenStakingContext);
};
