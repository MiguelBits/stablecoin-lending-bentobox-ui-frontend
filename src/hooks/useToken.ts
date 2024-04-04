import { useAccount, useContractReads } from 'wagmi';
import { BigNumberish, formatUnits } from 'ethers';
import { Abi } from 'viem';

import useNetwork from 'hooks/useNetwork';

import usdtAbi from 'contracts/abi/usdtAbi.json';

const useToken = (tokenAddress: `0x${string}`) => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const tokenContract = {
    address: tokenAddress,
    abi: usdtAbi as Abi,
    chainId: chain.id,
  };

  const { data: tokenData, refetch: refetchTokenData } = useContractReads({
    contracts: [
      {
        ...tokenContract,
        functionName: 'decimals',
      },
      {
        ...tokenContract,
        functionName: 'symbol',
      },
    ],
    select: (data) => {
      const results = [];
      for (let i = 0; i < data.length; i++) {
        results[i] = data[i].result;
      }

      return results;
    },
  });

  const { data: tokenStatistics, refetch: refetchTokenStatistics } =
    useContractReads({
      contracts: [
        {
          ...tokenContract,
          functionName: 'balanceOf',
          args: [address as `0x${string}`],
        },
      ],
      select: (data) => {
        const results: string[] = [];
        for (let i = 0; i < data.length; i++) {
          if (!data[i]) {
            results[i] = '0';
          } else {
            results[i] = formatUnits(
              data[i].result as BigNumberish,
              Number(tokenData?.[0])
            );
          }
        }
        return results;
      },
      enabled: !!tokenData?.[0] && !!address,
    });

  const refetch = async () => {
    Promise.all([refetchTokenData(), refetchTokenStatistics()]);
  };

  return {
    tokenContract,
    decimals: Number(tokenData?.[0]) || 0,
    tokenSymbol: tokenData?.[1] || '',
    balance: Number(tokenStatistics?.[0]) || 0,
    refetch,
  };
};

export default useToken;
