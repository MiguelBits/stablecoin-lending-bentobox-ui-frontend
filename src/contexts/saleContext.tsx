import React, { createContext, useContext, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { useToast } from '@chakra-ui/react';
import { BigNumberish, MaxUint256, formatUnits, parseUnits } from 'ethers';

import useSale from 'hooks/useSale';
import useToken from 'hooks/useToken';

import { useContractContext } from 'contexts/contractContext';

interface SaleProviderProps {
  children: React.ReactNode;
}

interface SaleContextProps {
  saleStartDate: Dayjs;
  saleEndDate: Dayjs;
  saleStage: number;
  vestingPeriod: number;
  saleCap: number;
  totalSold: number;
  minPurchase: number;
  maxPurchase: number;
  ratePer1e18: number;
  remainingTokens: number;
  amountPurchased: number;
  amountClaimed: number;
  amountVested: number;
  usdtBalance: number;
  // senBalance: number;
  isLoading: boolean;
  approveSale: () => Promise<void>;
  allowance: number;
  investSale: (amount: number) => Promise<void>;
}

dayjs.extend(duration);

const START_SALE_DATE = dayjs('2023-07-06');
const END_SALE_DATE = dayjs('2023-07-11');

export const SaleContext = createContext<SaleContextProps>({
  saleStartDate: START_SALE_DATE,
  saleEndDate: END_SALE_DATE,
  saleStage: 0,
  vestingPeriod: 0,
  saleCap: 0,
  totalSold: 0,
  minPurchase: 0,
  maxPurchase: 0,
  ratePer1e18: 0,
  remainingTokens: 0,
  amountPurchased: 0,
  amountClaimed: 0,
  amountVested: 0,
  usdtBalance: 0,
  // senBalance: 0,
  isLoading: false,
  approveSale: async () => {
    return;
  },
  allowance: 0,
  investSale: async () => {
    return;
  },
});

export const SaleProvider: React.FC<SaleProviderProps> = ({ children }) => {
  const toast = useToast();
  const { contracts } = useContractContext();
  const { address } = useAccount();
  const sale = useSale(contracts.SENECA_SALE.address);
  const usdtToken = useToken(contracts.USDT.address);
  // const senToken = useToken(contracts.SEN);
  const senDecimals = 18;

  const saleStartDate = useMemo(() => {
    return START_SALE_DATE;
  }, []);

  const saleEndDate = useMemo(() => {
    return END_SALE_DATE;
  }, []);

  const { data: allowance, refetch: refetchAllowance } = useContractRead({
    ...usdtToken.tokenContract,
    functionName: 'allowance',
    args: [address as `0x${string}`, contracts.SENECA_SALE.address],
    enabled: !!address,
    select: (data) => {
      return formatUnits(data as BigNumberish, usdtToken.decimals);
    },
  });

  const {
    data: approveData,
    writeAsync: approve,
    isLoading: approveIsLoading,
  } = useContractWrite({
    ...usdtToken.tokenContract,
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
      usdtToken.refetch();
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

  const approveSale = async () => {
    await approve({
      args: [contracts.SENECA_SALE.address, MaxUint256],
    });
  };

  const {
    data: investData,
    writeAsync: invest,
    isLoading: investIsLoading,
  } = useContractWrite({
    ...sale.saleContract,
    functionName: 'invest',
    onError: (err) => {
      console.group('INVEST ERROR');
      console.error(['ERROR NAME:'], err.name);
      console.error(['ERROR CAUSE:'], err.cause);
      console.error(['ERROR MESSAGE:'], err.message);
      console.error(['ERROR STACK:'], err.stack);
      console.groupEnd();

      toast({
        title: 'Invest Failed',
        description: 'Something went wrong! Please try again later.',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      });
    },
  });

  const { isLoading: investTxIsLoading } = useWaitForTransaction({
    hash: investData?.hash,
    onSuccess: () => {
      sale.refetch();
      usdtToken.refetch();

      toast({
        title: 'Invest Successful',
        description: 'You have successfully invested in SENECA.',
        isClosable: true,
        position: 'top-right',
        status: 'success',
        variant: 'success',
      });
    },
  });

  const investSale = async (amount: number) => {
    const parsedAmount = parseUnits(amount.toString(), senDecimals);
    await invest({ args: [address, parsedAmount] });
  };
  return (
    <SaleContext.Provider
      value={{
        saleStartDate,
        saleEndDate,
        saleStage: sale.saleStage,
        vestingPeriod: sale.vestingPeriod,
        saleCap: sale.saleCap,
        totalSold: sale.totalSold,
        minPurchase: sale.minPurchase,
        maxPurchase: sale.maxPurchase,
        ratePer1e18: sale.ratePer1e18,
        remainingTokens: sale.remainingTokens,
        amountPurchased: sale.amountPurchased,
        amountClaimed: sale.amountClaimed,
        amountVested: sale.amountVested,
        usdtBalance: usdtToken.balance,
        isLoading:
          approveIsLoading ||
          approveTxIsLoading ||
          investIsLoading ||
          investTxIsLoading,
        approveSale,
        allowance: Number(allowance),
        investSale,
      }}
    >
      {children}
    </SaleContext.Provider>
  );
};

export const useSaleContext = () => {
  return useContext(SaleContext);
};
