import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useContractReads,
} from 'wagmi';

import { CollateralToken } from 'models/collateralToken';
import { Balance } from 'models/web3';

import { useContractContext } from 'contexts/contractContext';

interface CollateralTokenProviderProps {
  children: React.ReactNode;
}

interface CollateralTokenContextProps {
  collateralTokens?: CollateralToken[];
  activeCollateralToken: CollateralToken | null;
  collateralTokenBalance?: Balance;
  collateralTokenAllowance?: bigint;
  updateActiveCollateralToken: (token: CollateralToken) => void;
  refetchData: () => void;
}

export const CollateralTokenContext =
  createContext<CollateralTokenContextProps>({
    collateralTokens: [],
    activeCollateralToken: null,
    updateActiveCollateralToken: () => {
      return;
    },
    refetchData: () => {
      return;
    },
  });

export const CollateralTokenProvider: React.FC<
  CollateralTokenProviderProps
> = ({ children }) => {
  const { address } = useAccount();
  const { contracts } = useContractContext();
  const [activeCollateralToken, setActiveCollateralToken] =
    useState<CollateralToken | null>(null);

  const { data: collateralTokenBalance } = useBalance({
    address,
    token: activeCollateralToken?.address,
    enabled: !!activeCollateralToken && !!address,
  });

  const {
    data: collateralTokenAllowance,
    refetch: refetchCollateralAllowance,
  } = useContractRead({
    address: activeCollateralToken?.address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address as `0x${string}`, contracts.STABLE_ENGINE.address],
    enabled: !!address && !!activeCollateralToken && !!contracts,
  });

  const { data: collateralTokenAddresses }: { data?: `0x${string}`[] } =
    useContractRead({
      ...contracts.STABLE_ENGINE,
      functionName: 'getCollateralTokens',
    });

  const { data: collateralTokens } = useContractReads({
    enabled: collateralTokenAddresses && collateralTokenAddresses?.length > 0,
    contracts: collateralTokenAddresses?.map((collateralTokenAddress) => {
      return {
        address: collateralTokenAddress,
        abi: erc20ABI,
        functionName: 'symbol',
      };
    }),
    select: (data) => {
      return data.map((item, i) => {
        return {
          symbol: String(item.result).toUpperCase(),
          address: collateralTokenAddresses?.[i] as `0x${string}`,
        };
      });
    },
  });

  useEffect(() => {
    if (collateralTokens && collateralTokens.length > 0) {
      setActiveCollateralToken(collateralTokens[0]);
    }
  }, [collateralTokens]);

  const updateActiveCollateralToken = (token: CollateralToken) => {
    setActiveCollateralToken(token);
  };

  const refetchData = async () => {
    Promise.all([refetchCollateralAllowance()]);
  };

  return (
    <CollateralTokenContext.Provider
      value={{
        collateralTokens,
        activeCollateralToken,
        collateralTokenBalance,
        collateralTokenAllowance,
        updateActiveCollateralToken,
        refetchData,
      }}
    >
      {children}
    </CollateralTokenContext.Provider>
  );
};

export const useCollateralTokenContext = () => {
  return useContext(CollateralTokenContext);
};
