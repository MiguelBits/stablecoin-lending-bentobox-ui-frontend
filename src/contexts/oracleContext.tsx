import { createContext, useContext } from 'react';
import { useContractRead } from 'wagmi';

import { useBorrowContext } from 'contexts/borrowContext';
import { useContractContext } from 'contexts/contractContext';

interface OracleProviderProps {
  children: React.ReactNode;
  amount: number;
  amountPriced: number;
}

interface OracleContextProps {
  activeCollateralAssetPriceFeed: number | unknown[];
  amountPriced: number | unknown[];
  amount: number;
  refetchData: () => void;
}

export const OracleContext = createContext<OracleContextProps>({
  activeCollateralAssetPriceFeed: 0,
  amountPriced: 0,
  amount: 0,
  refetchData: () => {
    return;
  },
});

export const OracleProvider: React.FC<OracleProviderProps> = ({
  children,
  amount,
}) => {
  const { contracts } = useContractContext();
  const { activeCollateralToken } = useBorrowContext(); //TODO move to collateral token context

  const {
    data: activeCollateralAssetPriceFeed,
    refetch: refetchActiveCollateralAssetPriceFeed,
  } = useContractRead({
    ...contracts.ORACLE,
    functionName: 'getOraclePrice',
    args: [activeCollateralToken?.address],
    enabled: !!activeCollateralToken && !!contracts,
  });

  const { data: amountPriced, refetch: refetchAmountPriced } = useContractRead({
    ...contracts.ORACLE,
    functionName: 'getAmountPriced',
    args: [amount, activeCollateralToken?.address],
    enabled: !!activeCollateralToken && !!contracts,
  });

  // console.group('ORACLE_CONTRACT');
  //console.log('activeCollateralAssetPriceFeed', activeCollateralAssetPriceFeed);
  //console.log('amountPriced', amountPriced);
  //console.log(contracts.ORACLE);
  // console.groupEnd();

  const refetchData = async () => {
    Promise.all([
      refetchActiveCollateralAssetPriceFeed(),
      refetchAmountPriced(),
    ]);
  };
  // const actualValue = Array.isArray(activeCollateralAssetPriceFeed) ? activeCollateralAssetPriceFeed[0] : activeCollateralAssetPriceFeed;

  return (
    <OracleContext.Provider
      value={{
        activeCollateralAssetPriceFeed: 0,
        amount: amount || 0,
        refetchData,
        amountPriced: amountPriced || 0,
      }}
    >
      {children}
    </OracleContext.Provider>
  );
};

export const useOracleContext = () => {
  return useContext(OracleContext);
};
