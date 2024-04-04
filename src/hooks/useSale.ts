import { useAccount, useContractRead, useContractReads } from 'wagmi';
import { Abi } from 'viem';
import { useMemo } from 'react';
import { BigNumberish, formatUnits } from 'ethers';
import dayjs from 'dayjs';

import useToken from 'hooks/useToken';
import useNetwork from 'hooks/useNetwork';

import saleAbi from 'contracts/abi/senecaSale.json';

// NOTE:
// saleAddress = sale contract address
// tokenAddress = token being sold
const useSale = (
  saleAddress: `0x${string}`
  //  tokenAddress: `0x${string}`
) => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const saleContract = {
    address: saleAddress,
    abi: saleAbi as Abi,
    chainId: chain.id,
  };

  const { data: saleDetails } = useContractReads({
    contracts: [
      {
        ...saleContract,
        functionName: 'payToken',
      },
      {
        ...saleContract,
        functionName: 'saleStage',
      },
      {
        ...saleContract,
        functionName: 'vestingPeriod',
      },
    ],
  });

  // const token = useToken(tokenAddress);
  const tokenDecimals = 18;
  const payToken = useToken(saleDetails?.[0].result as `0x${string}`);

  const { data: saleStatistics, refetch: refetchSaleStatistics } =
    useContractReads({
      contracts: [
        {
          ...saleContract,
          functionName: 'saleCap',
        },
        {
          ...saleContract,
          functionName: 'totalSold',
        },
        {
          ...saleContract,
          functionName: 'minPurchase',
        },
        {
          ...saleContract,
          functionName: 'maxPurchase',
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
              Number(tokenDecimals)
            );
          }
        }

        return results;
      },
    });

  const { data: userSaleData, refetch: refetchUserSaleData } = useContractReads(
    {
      contracts: [
        {
          ...saleContract,
          functionName: 'amountPurchased',
          args: [address as `0x${string}`],
        },
        {
          ...saleContract,
          functionName: 'amountClaimed',
          args: [address as `0x${string}`],
        },
        {
          ...saleContract,
          functionName: 'amountVested',
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
              data[i].result as bigint,
              Number(tokenDecimals)
            );
          }
        }
        return results;
      },
      enabled: !!tokenDecimals && !!address,
    }
  );

  const { data: ratePer1e18 } = useContractRead({
    ...saleContract,
    functionName: 'ratePer1e18',
    select: (data) => {
      return formatUnits(data as BigNumberish, Number(payToken.decimals));
    },
  });

  const remainingTokens = useMemo(() => {
    if (saleStatistics) {
      // NOTE Amount transferred from dao to wallet $32,335.62
      const transferredAmountInUsd = 32335.62;
      const transferredAmount = transferredAmountInUsd / Number(ratePer1e18);

      const remainingTokensFromInvest = Number(
        Number(saleStatistics?.[0]) - Number(saleStatistics?.[1])
      );

      const remainingTokensAfterTransfer =
        remainingTokensFromInvest - transferredAmount;

      return remainingTokensAfterTransfer;
    }
    return 0;
  }, [ratePer1e18, saleStatistics]);

  const refetch = async () => {
    await Promise.all([refetchSaleStatistics(), refetchUserSaleData()]);
  };

  const formattedVestingPeriod = useMemo(() => {
    return (
      dayjs.duration(Number(saleDetails?.[2].result) || 0).asMonths() * 1000
    );
  }, [saleDetails]);

  return {
    saleContract,
    payToken: saleDetails?.[0].result || '',
    saleStage: Number(saleDetails?.[1].result) || 0,
    vestingPeriod: formattedVestingPeriod || 0,
    saleCap: Number(saleStatistics?.[0]) || 0,
    totalSold: Number(saleStatistics?.[1]) || 0,
    minPurchase: Number(saleStatistics?.[2]) || 0,
    maxPurchase: Number(saleStatistics?.[3]) || 0,
    ratePer1e18: Number(ratePer1e18) || 0,
    remainingTokens,
    amountPurchased: Number(userSaleData?.[0]) || 0,
    amountClaimed: Number(userSaleData?.[1]) || 0,
    amountVested: Number(userSaleData?.[2]) || 0,
    refetch,
  };
};

export default useSale;
