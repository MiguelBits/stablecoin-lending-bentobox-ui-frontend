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

interface VesenProviderProps {
  children: React.ReactNode;
}
interface VesenContextProps {
  vesenTokens?: VesenToken[];
  activeVesenToken?: VesenToken | null;
  vesenTokenBalance?: Balance;
  vesen2TokenBalance?: Balance;
  bptTokenBalance?: Balance;
  currentEpoch?: bigint;
  epoch1Time?: bigint;
  epochDuration?: bigint;
  epochsPerLock?: bigint;
  userLocks?: { amount: bigint; start: bigint; renewed: boolean }[] | undefined;
  lockers?: string[];
  userLockCount?: string[];
  createLockFunction?: (amount: number) => Promise<void>;
  stakeFunction?: (amount: number) => Promise<void>;
  unstakeFunction?: (amount: number) => Promise<void>;
  createLockIsLoading?: boolean;
  createLockTxHash?: string;
  vesenTokenAllowance?: bigint;
  senTokenAllowance?: bigint;
  sSenTokenAllowance?: bigint;
  collateralUsdValue: number;
  earliestUnlock?: bigint;
  readClaimableVesenRewards?: bigint;
  claimVesenRewards?: () => Promise<void>;
  isLoading?: boolean;
  refetchData: () => void;
  approveBPT: () => Promise<void>;
}

export const VesenContext = createContext<VesenContextProps>({
  vesenTokens: [],
  activeVesenToken: null,
  currentEpoch: undefined,
  epoch1Time: undefined,
  epochDuration: undefined,
  collateralUsdValue: 0,
  epochsPerLock: undefined,
  userLocks: [],
  lockers: [],
  earliestUnlock: undefined,
  readClaimableVesenRewards: undefined,

  createLockFunction: async () => {
    return;
  },

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
  approveBPT: async () => {
    return;
  },
  refetchData: () => {
    return;
  },
  createLockIsLoading: false,
});

export const VesenProvider: React.FC<VesenProviderProps> = ({ children }) => {
  const toast = useToast();
  const { address } = useAccount();
  const { contracts } = useContractContext();
  const bptTokenAddress = useVesen(contracts.SVESEN?.address);
  const registry = contracts.REGISTRY?.address;
  const distributor = contracts.SENREWARDS?.address;
  // eslint-disable-next-line
  const [activeVesenToken, setActiveVesenToken] = useState<VesenToken | null>(
    null
  );
  const index = 0;

  const { data: vesen2TokenBalance, refetch: refetchVesen2TokenBalance } =
    useBalance({
      address,
      token: contracts.SVESEN?.address,
      enabled: !!contracts && !!address,
    });

  const { data: vesenTokenBalance, refetch: refetchVesenTokens } = useBalance({
    address,
    token: contracts.VESEN?.address,
    enabled: !!contracts && !!address,
  });

  const { data: bptTokenBalance } = useBalance({
    address,
    token: contracts?.bptToken?.address,
    enabled: !!contracts && !!address,
  });

  const collateralUsdValue = readContract({
    ...contracts.ORACLE,
    functionName: 'getAmountPriced',
    args: [10, contracts.WETH?.address],
  });

  //eslint-disable-next-line
  const { data: vesenTokenAllowance, refetch: refetchAllowance } =
    useContractRead({
      address: contracts.SVESEN?.address,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [address as `0x${string}`, contracts.VESEN?.address],
      enabled: !!address && !!contracts,
    });

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

  const { data: vesenTokenAddresses }: { data?: `0x${string}`[] } =
    useContractRead({
      ...contracts.VESEN,
      functionName: 'getCollateralTokens',
    });

  const { data: vesenTokens } = useContractReads({
    enabled: vesenTokenAddresses && vesenTokenAddresses?.length > 0,
    contracts: vesenTokenAddresses?.map((vesenTokenAddress) => {
      return {
        address: vesenTokenAddress,
        abi: erc20ABI,
        functionName: 'symbol',
      };
    }),
    select: (data) => {
      return data.map((item, i) => {
        return {
          symbol: String(item.result).toUpperCase(),
          address: vesenTokenAddresses?.[i] as `0x${string}`,
        };
      });
    },
  });

  const {
    data: earliestUnlock,
    // refetch: refetchCollateralAllowance,
  } = useContractRead({
    address: registry,
    abi: registryAbi,
    functionName: 'earliestUnlockTimestamp',
    args: [address as `0x${string}`],
    enabled: !!address && !!contracts,
  });

  const { data: readClaimableVesenRewards } = useContractRead({
    address: distributor,
    abi: rewardsDistributor,
    functionName: 'getTotalUserTokensClaimable',
    args: [address as `0x${string}`, contracts.SEN?.address],
    enabled: !!address && !!contracts,
  });

  const { data: claimVesenRewardsData, writeAsync: claimVesen } =
    useContractWrite({
      address: distributor,
      abi: rewardsDistributor,
      functionName: 'claimTokens',
      args: [[contracts.SEN?.address]],
    });

  //@ts-ignore  There's an issue with this specific line, and we're ignoring it for now.
  const {
    data: vesenContractData,
    refetch: refetchVesenContractData,
  }: {
    data?: [
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint[],
      bigint,
      bigint,
      bigint
    ];
    refetch: () => Promise<void>;
  } = useContractReads({
    contracts: [
      {
        ...contracts.VESEN,
        functionName: 'currentEpoch',
      },
      {
        ...contracts.VESEN,
        functionName: 'epoch1Time',
      },
      {
        ...contracts.VESEN,
        functionName: 'epochDuration',
      },
      {
        ...contracts.VESEN,
        functionName: 'epochsPerLock',
      },
      {
        ...contracts.VESEN,
        functionName: 'getUserLock',
        args: [address as `0x${string}`, index],
      },
      {
        ...contracts.VESEN,
        functionName: 'lockers',
      },
      {
        ...contracts.VESEN,
        functionName: 'totalLockers',
      },
      {
        ...contracts.VESEN,
        functionName: 'userLockCount',
        args: [address as `0x${string}`],
      },
    ],
    select: (data) => {
      return data.map((item) => {
        return item.result;
      });
    },
  });

  const {
    data: approveData,
    writeAsync: approve,
    isLoading: approveIsLoading,
  } = useContractWrite({
    ...bptTokenAddress.bptContract,
    functionName: 'approve',
    onError: (err) => {
      console.group('APPROVE ERROR');
      console.error(['ERROR NAME:'], err.name);
      console.error(['ERROR CAUSE:'], err.cause);
      console.error(['ERROR MESSAGE:'], err.message);
      console.error(['ERROR STACK:'], err.stack);
      console.groupEnd();

      toast({
        title: 'Approval Failed',
        description: 'Something went wrong',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      });
    },
  });

  const { isLoading: approveTxIsLoading } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: () => {
      refetchAllowance();

      toast({
        title: 'Approval Successful',
        description: 'You have successfully approved the use of your token.',
        isClosable: true,
        position: 'top-right',
        status: 'success',
        variant: 'success',
      });
    },
  });

  const approveBPT = async () => {
    await approve({
      args: [contracts.VESEN?.address, MaxUint256],
    });
  };
  //console.log('vesenContractData', vesenContractData);

  const claimVesenRewards = async () => {
    await claimVesen({
      args: [[contracts.SEN?.address]],
    });
  };

  const {
    writeAsync: createLock,
    //eslint-disable-next-line
    isLoading: createLockIsLoading,
    data: createLockData,
  } = useContractWrite({
    ...contracts.VESEN,
    functionName: 'createLock',
    onError: (err) => {
      console.group('CREATE LOCK ERROR');
      console.error(['ERROR NAME:'], err.name);
      console.error(['ERROR CAUSE:'], err.cause);
      console.error(['ERROR MESSAGE:'], err.message);
      console.error(['ERROR STACK:'], err.stack);
      console.groupEnd();

      toast({
        title: 'Create Lock Failed',
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
    isLoading: createLockTxIsLoading,
  } = useWaitForTransaction({
    hash: createLockData?.hash,
    onSuccess: () => {
      refetchData();
      toast({
        title: 'Lock Created',
        description: 'Your lock has been created successfully.',
        isClosable: true,
        position: 'top-right',
        status: 'success',
        variant: 'success',
      });
    },
  });

  const createLockFunction = async (amount: number) => {
    try {
      await createLock({
        args: [address, amount],
      });
    } catch (error) {
      console.error('Error creating Vesen lock:', error);
    }
  };

  //STAKE

  const {
    writeAsync: stake,
    //eslint-disable-next-line
    isLoading: stakeIsLoading,
    data: stakeData,
  } = useContractWrite({
    ...contracts.SSEN,
    functionName: 'deposit',
    onError: (err) => {
      console.group('CREATE LOCK ERROR');
      console.error(['ERROR NAME:'], err.name);
      console.error(['ERROR CAUSE:'], err.cause);
      console.error(['ERROR MESSAGE:'], err.message);
      console.error(['ERROR STACK:'], err.stack);
      console.groupEnd();

      toast({
        title: 'Deposit Tokens Failed',
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
    isLoading: stakeTxIsLoading,
  } = useWaitForTransaction({
    hash: stakeData?.hash,
    onSuccess: () => {
      refetchData();
      toast({
        title: 'Deposit Created',
        description: 'Your deposit has been created successfully.',
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
      console.group('CREATE LOCK ERROR');
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
        title: 'Deposit Created',
        description: 'Your deposit has been created successfully.',
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
      console.error('Error creating deposit', error);
    }
  };

  const currentEpoch = vesenContractData?.[0] as bigint | undefined;
  const epoch1Time = vesenContractData?.[1] as bigint | undefined;
  const epochDuration = vesenContractData?.[2] as bigint | undefined;
  const epochsPerLock = vesenContractData?.[3] as bigint | undefined;
  const userLocks = vesenContractData?.[4] as
    | { amount: bigint; start: bigint; renewed: boolean }[]
    | undefined;
  const lockers = vesenContractData?.[6] as string[] | undefined;
  const userLockCount = vesenContractData?.[7] as string[] | undefined;
  //console.log('lockers', lockers);
  //console.log('userLock', userLocks);
  useEffect(() => {
    if (vesenTokens && vesenTokens.length > 0) {
      setActiveVesenToken(vesenTokens[0]);
    }
  }, [vesenTokens]);

  const refetchData = async () => {
    Promise.all([
      refetchVesenContractData(),
      refetchVesenTokens(),
      refetchVesen2TokenBalance(),
      refetchsenAllowance(),
      refetchSSENAllowance(),
    ]);
  };

  //console.log('userLocks ', userLocks);
  return (
    <VesenContext.Provider
      value={{
        vesenTokenBalance,
        currentEpoch,
        epoch1Time,
        epochDuration,
        epochsPerLock,
        userLocks: vesenContractData?.[4] as
          | { amount: bigint; start: bigint; renewed: boolean }[]
          | undefined,
        userLockCount,
        lockers,
        vesen2TokenBalance,
        bptTokenBalance,
        collateralUsdValue: Number(collateralUsdValue) || 0,
        earliestUnlock: earliestUnlock as bigint,
        readClaimableVesenRewards: readClaimableVesenRewards as bigint,
        claimVesenRewards,
        createLockFunction,
        stakeFunction,
        unstakeFunction,
        refetchData,
        vesenTokenAllowance,
        senTokenAllowance,
        sSenTokenAllowance,
        isLoading:
          approveIsLoading ||
          approveTxIsLoading ||
          createLockIsLoading ||
          createLockTxIsLoading,
        approveBPT,

        // isloading:
        //   createLockTxIsLoading ||
        //   createLockIsLoading,
        // renewLock,
        // renewLockIsLoading,
        // renewAllLocks,
        // renewAllLocksIsLoading,
        // withdrawLock,
        // withdrawLockIsLoading,
        // withdrawAllExpiredLocks,
        // withdrawAllExpiredLocksIsLoading,
      }}
    >
      {children}
    </VesenContext.Provider>
  );
};

export const useVesenContext = () => {
  return useContext(VesenContext);
};

//TODO

// const {
//   writeAsync: renewLock,
//   isLoading: renewLockIsLoading,
// } = useContractWrite({
//   ...contracts.VESEN,
//   functionName: 'renewLock',
//   onError: (err) => {
//     // Handle error and show toast
//   },
// });

// const {
//   writeAsync: renewAllLocks,
//   isLoading: renewAllLocksIsLoading,
// } = useContractWrite({
//   ...contracts.VESEN,
//   functionName: 'renewAllLocks',
//   onError: (err) => {
//     // Handle error and show toast
//   },
// });

// const {
//   writeAsync: withdrawLock,
//   isLoading: withdrawLockIsLoading,
// } = useContractWrite({
//   ...contracts.VESEN,
//   functionName: 'withdrawLock',
//   onError: (err) => {
//     // Handle error and show toast
//   },
// });

// const {
//   writeAsync: withdrawAllExpiredLocks,
//   isLoading: withdrawAllExpiredLocksIsLoading,
// } = useContractWrite({
//   ...contracts.VESEN,
//   functionName: 'withdrawAllExpiredLocks',
//   onError: (err) => {
//     // Handle error and show toast
//   },
// });
