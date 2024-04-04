import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useContractReads,
} from 'wagmi';
import { readContract } from '@wagmi/core';
import { formatUnits } from 'ethers';
import BigNumber from 'bignumber.js';

import { CollateralToken } from 'models/collateralToken';
import { Balance } from 'models/web3';

import { useContractContext } from 'contexts/contractContext';

import registryAbi from 'contracts/abi/registryAbi.json';
import stableEngine from 'contracts/abi/stableEngine.json';

type EngineContracts = {
  [key: string]: {
    address: `0x${string}`;
    abi: any;
  };
};

interface BorrowProviderProps {
  children: React.ReactNode;
}

interface BorrowContextProps {
  collateralTokens?: CollateralToken[];
  activeCollateralToken: CollateralToken | null;
  collateralTokenBalance?: Balance;
  collateralPrice: bigint;
  feePercentage: bigint;
  healthFactor?: bigint;
  minHealthFactor?: bigint;
  collateralTokenAllowance?: bigint;
  senTokenBalance?: Balance;
  senUSDTokenAllowance?: bigint;
  senUSDLeftToBorrow?: bigint;
  tvlCalculation?: bigint;
  accountInformation?: bigint[];
  vaultMintCap?: bigint;
  senTokenLeftToMint?: Balance;
  vaultMintedAmount?: bigint;
  liquidationThreshold?: bigint;
  interestRate?: bigint;
  liquidationBonus?: bigint;
  mintableSenTokens?: string;
  amountPriced?: number;
  tvlWethEngine?: bigint;
  tvlStethEngine?: bigint;
  liquidationPrice?: bigint;
  maxMintable?: bigint;
  tvlrEngine?: bigint;
  depositedCollateral?: bigint;
  selectedEngineContractList?: EngineContracts;
  updateActiveCollateralToken: (token: CollateralToken) => void;
  refetchData: () => void;
  calculateMintableTokens: (collateralAmount: string) => Promise<string>;
}

export const BorrowContext = createContext<BorrowContextProps>({
  collateralTokens: [],
  activeCollateralToken: null,
  tvlCalculation: BigInt(0),
  feePercentage: BigInt(0),
  amountPriced: 0,
  collateralPrice: BigInt(0),
  senUSDLeftToBorrow: BigInt(0),
  updateActiveCollateralToken: () => {
    return;
  },
  refetchData: () => {
    return;
  },
  calculateMintableTokens: async () => {
    return '';
  },
});

export const BorrowProvider: React.FC<BorrowProviderProps> = ({ children }) => {
  const { address } = useAccount();
  const { contracts } = useContractContext();
  const senUSD = contracts.SENUSD?.address;
  const registry = contracts.REGISTRY?.address;
  const [activeCollateralToken, setActiveCollateralToken] =
    useState<CollateralToken | null>(null);

  const {
    data: collateralTokenBalance,
    refetch: refetchCollateralTokenBalance,
  } = useBalance({
    address,
    token: activeCollateralToken?.address,
    enabled: !!activeCollateralToken && !!address,
  });

  const ENGINE_CONTRACTS: EngineContracts = {
    WETH: contracts.WETH_ENGINE,
    RUSDC: contracts.RUSDC_ENGINE,
    STETH: contracts.STETH_ENGINE,
  };

  console.log('my addres new', address);

  //console.log('Active Collateral Token Symbol:', activeCollateralToken?.symbol);
  const selectedEngineContract =
    ENGINE_CONTRACTS[activeCollateralToken?.symbol ?? ''];
  //console.log('Selected Engine Contract :', selectedEngineContract);

  const { data: senTokenBalance, refetch: refetchSenTokenBalance } = useBalance(
    {
      address,
      token: contracts.SENUSD?.address,
      enabled: !!contracts && !!address,
    }
  );

  const { data: senUSDTokenAllowance, refetch: refetchSenUSDTokenAllowance } =
    useContractRead({
      address: senUSD,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [address as `0x${string}`, contracts.SENBOX?.address],
      enabled: !!address && !!senUSD && !!contracts,
    });

  console.log('senUSDTokenAllowance', senUSDTokenAllowance);

  const {
    data: tvlCalculation,
    // refetch: refetchCollateralAllowance,
  } = useContractRead({
    address: registry,
    abi: registryAbi,
    functionName: 'getTotalCollateralUSDValue',
    enabled: !!address && !!senUSD && !!contracts,
  });

  const {
    data: tvlWethEngine,
    // refetch: refetchCollateralAllowance,
  } = useContractRead({
    ...contracts.REGISTRY,
    functionName: 'getUSDValueForSpecificCollateral',
    args: [contracts.WETH.address],
  });
  console.log('tvl weth', tvlWethEngine);

  const {
    data: tvlStethEngine,
    // refetch: refetchCollateralAllowance,
  } = useContractRead({
    address: registry,
    abi: registryAbi,
    functionName: 'getUSDValueForSpecificCollateral',
    args: [contracts.STETH.address],
  });
  const { data: liquidationPriceChamber, refetch: liquidationRefetch } =
    useContractRead({
      ...selectedEngineContract,
      abi: stableEngine,
      functionName: 'getLiquidationPrice',
      args: [address as `0x${string}`],
    });

  console.log('liqPrice', liquidationPriceChamber);
  const { data: debtUser, refetch: debtUserRefetch } = useContractRead({
    ...selectedEngineContract,
    abi: stableEngine,
    functionName: `s_SenUSDMinted(${address as `0x${string}`})`,
  });

  console.log(debtUser);
  const { data: maxDebt, refetch: maxDebtRefetch } = useContractRead({
    ...selectedEngineContract,
    abi: stableEngine,
    functionName: 'getMaxDebt',
    args: [address as `0x${string}`],
  });

  const { data: debtToCover, refetch: debtToCoverRefetch } = useContractRead({
    ...selectedEngineContract,
    abi: stableEngine,
    functionName: 'getDebtToCover',
    args: [address as `0x${string}`],
  });

  const { data: maxMintable, refetch: MaxMintableFetch } = useContractRead({
    ...selectedEngineContract,
    abi: stableEngine,
    functionName: 'getMaxMintableWithFee',
    args: [address as `0x${string}`],
  });

  console.log('Minted senUSD', debtToCover);

  const {
    data: tvlrEngine,
    // refetch: refetchCollateralAllowance,
  } = useContractRead({
    address: registry,
    abi: registryAbi,
    functionName: 'getUSDValueForSpecificCollateral',
    args: [contracts.RUSDC.address],
  });

  const {
    data: collateralTokenAllowance,
    refetch: refetchCollateralAllowance,
  } = useContractRead({
    address: activeCollateralToken?.address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address as `0x${string}`, selectedEngineContract?.address],
  });

  //console.log('collateralTokenAllowance:', collateralTokenAllowance);
  // console.log(
  //   'selectedEngineContract address:',
  //   selectedEngineContract?.address
  // );

  const { data: collateralTokenAddresses }: { data?: `0x${string}`[] } =
    useContractRead({
      ...contracts.STABLE_ENGINE,
      functionName: 'getCollateralTokens',
    });

  const { data: collateralTokens } = useContractReads({
    enabled: collateralTokenAddresses && collateralTokenAddresses.length > 0,
    contracts: collateralTokenAddresses?.map(
      (collateralTokenAddress, stableEngineAddresses) => {
        return {
          address: collateralTokenAddress,
          stableEngineAddress: stableEngineAddresses,
          abi: erc20ABI,
          functionName: 'symbol',
        };
      }
    ),
    select: (data) => {
      return data.map((item, i) => {
        return {
          symbol: String(item.result).toUpperCase(),
          address: collateralTokenAddresses?.[i] as `0x${string}`,
        };
      });
    },
  });

  //@ts-ignore  There's an issue with this specific line, and we're ignoring it for now.
  const {
    data: userData,
    refetch: refetchUserData,
  }: {
    data?: [bigint, bigint[], bigint, bigint];
    refetch: () => Promise<void>;
  } = useContractReads({
    contracts: [
      {
        ...selectedEngineContract,
        functionName: 'getHealthFactor',
        args: [address as `0x${string}`],
      },
      {
        ...selectedEngineContract,
        functionName: 'getAccountInformation',
        args: [address as `0x${string}`],
      },
      {
        ...selectedEngineContract,
        functionName: 'getCollateralBalanceOfUser',
        args:
          address &&
          activeCollateralToken &&
          collateralTokenAddresses &&
          activeCollateralToken.address === collateralTokenAddresses[0]
            ? [address as `0x${string}`, collateralTokenAddresses[0]]
            : address &&
              activeCollateralToken &&
              collateralTokenAddresses &&
              activeCollateralToken.address === collateralTokenAddresses[1]
            ? [address as `0x${string}`, collateralTokenAddresses[1]]
            : address &&
              activeCollateralToken &&
              collateralTokenAddresses &&
              activeCollateralToken.address === collateralTokenAddresses[2]
            ? [address as `0x${string}`, collateralTokenAddresses[2]]
            : undefined,
      },
    ],
    select: (data) => {
      return data.map((item) => {
        return item.result;
      });
    },
    enabled: !!address,
  });

  console.log('userData', userData?.[2]);

  //console.log('collateral deposit', userData?.[2]);

  //@ts-ignore  ignoring to see if dapp runs
  const { data, refetch: refetchDataRead }: { data?: bigint[] } =
    useContractReads({
      contracts: [
        {
          ...selectedEngineContract,
          functionName: 'FEE_PERCENTAGE',
        },
        {
          ...selectedEngineContract,
          functionName: 'getMinHealthFactor',
        },
        {
          ...selectedEngineContract,
          functionName: 'vaultMintCap',
        },
        {
          ...selectedEngineContract,
          functionName: 'vaultMintedAmount',
        },
        {
          ...selectedEngineContract,
          functionName: 'getLiquidationThreshold',
        },
        {
          ...selectedEngineContract,
          functionName: 'INTEREST_RATE',
        },
        {
          ...selectedEngineContract,
          functionName: 'INTEREST_RATE',
        },
        {
          ...selectedEngineContract,
          functionName: 'LIQUIDATION_BONUS',
        },
      ],
      select: (data) => {
        return data.map((item) => {
          return item.result;
        });
      },
    });
  //console.log('fee %', data?.[0]);

  //@ts-ignore  There's an issue with this specific line, and we're ignoring it for now..
  const {
    data: marketData,
    refetch: refetchMarketData,
  }: {
    data?: [bigint, bigint, bigint, bigint, MarketDataItem];
    refetch: () => Promise<void>;
  } = useContractReads({
    contracts: [
      {
        ...contracts.MARKET,
        functionName: 'getBorrowFee',
        args: [selectedEngineContract?.address],
      },
      {
        ...contracts.MARKET,
        functionName: 'getCollateralPrice',
        args: [selectedEngineContract?.address],
      },
      {
        ...contracts.MARKET,
        functionName: 'getHealthFactor',
        args: [selectedEngineContract?.address, address as `0x${string}`],
      },
      {
        ...contracts.MARKET,
        functionName: 'getInterestPerYear',
        args: [selectedEngineContract?.address],
      },
      {
        ...contracts.MARKET,
        functionName: 'getMarketInfoCauldronV2',
        args: [selectedEngineContract?.address],
      },
      {
        ...contracts.MARKET,
        functionName: 'getMarketInfoCauldronV3',
        args: [selectedEngineContract?.address],
      },
      {
        ...contracts.MARKET,
        functionName: 'getMaxMarketBorrowForCauldronV2',
        args: [selectedEngineContract?.address],
      },
      {
        ...contracts.MARKET,
        functionName: 'getMaxMarketBorrowForCauldronV3',
        args: [selectedEngineContract?.address],
      },
      {
        ...contracts.MARKET,
        functionName: 'getMaxUserBorrowForCauldronV2',
        args: [selectedEngineContract?.address],
      },
      {
        ...contracts.MARKET,
        functionName: 'getMaxUserBorrowForCauldronV3',
        args: [selectedEngineContract?.address],
      },
      {
        ...contracts.MARKET,
        functionName: 'getMaximumCollateralRatio',
        args: [selectedEngineContract?.address],
      },
      {
        ...contracts.MARKET,
        functionName: 'getOracleExchangeRate',
        args: [selectedEngineContract?.address],
      },
      {
        ...contracts.MARKET,
        functionName: 'getTokenInBentoBox',
        args: [
          contracts.SENBOX?.address,
          selectedEngineContract?.address,
          address as `0x${string}`,
        ],
      },
      {
        ...contracts.MARKET,
        functionName: 'getTotalBorrowed',
        args: [selectedEngineContract?.address],
      },
      {
        ...contracts.MARKET,
        functionName: 'getTotalCollateral',
        args: [selectedEngineContract?.address],
      },
      {
        ...contracts.MARKET,
        functionName: 'getUserBorrow',
        args: [selectedEngineContract?.address, address as `0x${string}`],
      },
      {
        ...contracts.MARKET,
        functionName: 'getUserCollateral',
        args: [selectedEngineContract?.address, address as `0x${string}`],
      },
      {
        ...contracts.MARKET,
        functionName: 'getUserLiquidationPrice',
        args: [selectedEngineContract?.address, address as `0x${string}`],
      },
      {
        ...contracts.MARKET,
        functionName: 'getUserLtv',
        args: [selectedEngineContract?.address, address as `0x${string}`],
      },
      {
        ...contracts.MARKET,
        functionName: 'getUserMaxBorrow',
        args: [selectedEngineContract?.address, address as `0x${string}`],
      },
      {
        ...contracts.MARKET,
        functionName: 'getUserPosition',
        args: [selectedEngineContract?.address, address as `0x${string}`],
      },
      {
        ...contracts.MARKET,
        functionName: 'getUserPositions',
        args: [selectedEngineContract?.address, [address as `0x${string}`]],
      },
    ],
    select: (data) => {
      return data.map((item) => {
        return item.result;
      });
    },
  });

  console.log('marketdata', marketData?.[4]);

  interface MarketDataItem {
    cauldron: string;
    borrowFee: bigint;
    maximumCollateralRatio: bigint;
    liquidationFee: bigint;
    interestPerYear: bigint;
    collateralPrice: bigint;
    marketMaxBorrow: bigint;
    oracleExchangeRate: bigint;
    totalBorrowed: bigint;
    totalCollateral: bigint;
    userMaxBorrow: bigint;
  }

  const marketDataItem: MarketDataItem | undefined = marketData?.[4];

  if (
    marketDataItem &&
    typeof marketDataItem === 'object' &&
    marketDataItem !== null
  ) {
    const {
      cauldron,
      borrowFee,
      maximumCollateralRatio,
      liquidationFee,
      interestPerYear,
      collateralPrice,
      marketMaxBorrow,
      oracleExchangeRate,
      totalBorrowed,
      totalCollateral,
      userMaxBorrow,
    } = marketDataItem;

    console.log('cauldron:', cauldron);
    console.log('borrowFee:', borrowFee);
    console.log('maximumCollateralRatio:', maximumCollateralRatio);
    console.log('liquidationFee:', liquidationFee);
    console.log('interestPerYear:', interestPerYear);
    console.log('collateralPrice:', collateralPrice);
    console.log('marketMaxBorrow:', marketMaxBorrow);
    console.log('oracleExchangeRate:', oracleExchangeRate);
    console.log('totalBorrowed:', totalBorrowed);
    console.log('totalCollateral:', totalCollateral);
    console.log('userMaxBorrow:', userMaxBorrow);
  } else {
    console.log(
      "marketData is null, undefined, or doesn't have the expected structure."
    );
  }

  const senTokenLeftToMint = useMemo(() => {
    // Total amount of sen tokens that can still be minted to avoid cap
    if (data?.[2] && data?.[3]) {
      const vaultMintCapBigN = new BigNumber(data?.[2].toString());
      const vaultMintedAmountBigN = new BigNumber(
        (data?.[3] as bigint).toString()
      );
      const leftToMint = vaultMintCapBigN.minus(vaultMintedAmountBigN);

      return {
        value: leftToMint,
        formatted: formatUnits(
          leftToMint.toString(),
          senTokenBalance?.decimals
        ),
      };
    }

    return { value: 0, formatted: '0' };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.[2], data?.[3], senTokenBalance?.decimals]);

  //console.log('mintedcap', userData?.[2]);

  const mintableSenTokens = useMemo(() => {
    // Amount of tokens that the user can still mint dependent on the collateral deposited
    if (userData?.[0] && userData[1] && data?.[1]) {
      const collateralBigN = new BigNumber(userData?.[1][1].toString());
      const healthFactorBigN = new BigNumber((data?.[1] as bigint).toString());
      const leftToMint = collateralBigN.div(healthFactorBigN);

      return leftToMint.toString();
    }

    return '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.[0], data?.[1]]);

  useEffect(() => {
    if (collateralTokens && collateralTokens.length > 0) {
      setActiveCollateralToken(collateralTokens[0]);
    }
  }, [collateralTokens]);

  const updateActiveCollateralToken = (token: CollateralToken) => {
    setActiveCollateralToken(token);
  };

  const refetchData = async () => {
    Promise.all([
      refetchCollateralAllowance(),
      refetchUserData(),
      refetchDataRead(),
      refetchSenTokenBalance(),
      refetchSenUSDTokenAllowance(),
      refetchCollateralTokenBalance(),
      liquidationRefetch(),
      maxDebtRefetch(),
      MaxMintableFetch(),
      refetchMarketData(),
    ]);
  };

  function calculateLiquidationPriceContract(
    totalSenUSDDebt: BigNumber,
    collateralValueInUsd: BigNumber,
    LIQUIDATION_THRESHOLD: BigNumber
  ): BigNumber {
    if (totalSenUSDDebt.isEqualTo(0) || collateralValueInUsd.isEqualTo(0)) {
      return new BigNumber(0);
    }

    const debtPart = totalSenUSDDebt
      .multipliedBy(new BigNumber(1e18))
      .dividedBy(collateralValueInUsd);
    const thresholdPart = debtPart
      .multipliedBy(LIQUIDATION_THRESHOLD)
      .dividedBy(new BigNumber(1e18));

    return collateralValueInUsd.minus(thresholdPart);
  }

  // console.log(calculateLiquidationPriceContract(vaultMintedAmount, ))

  const calculateMintableTokens = async (collateralAmount: string) => {
    if (!collateralAmount || Number.isNaN(Number(collateralAmount))) {
      // Don't run function if amount is NaN
      return '';
    }

    // Get usd value of deducted amount
    const collateralUsdValue = await readContract({
      ...contracts.ORACLE,
      functionName: 'getOraclePrice',
      args: [activeCollateralToken?.address],
    });

    //console.log('collateral value', collateralUsdValue);
    const mintableTokens = new BigNumber(collateralUsdValue.toString()).div(
      new BigNumber((data?.[1] as bigint).toString())
    );
    //console.log('mintableTokens', mintableTokens);
    return mintableTokens.toString();
  };
  console.log('liqdata', data?.[7]);
  return (
    <BorrowContext.Provider
      value={{
        collateralTokens,
        activeCollateralToken,
        collateralTokenBalance,
        collateralPrice: marketDataItem?.collateralPrice as bigint,
        feePercentage: marketDataItem?.borrowFee as bigint,
        healthFactor: userData?.[0],
        minHealthFactor: data?.[1],
        collateralTokenAllowance,
        tvlWethEngine:
          typeof tvlWethEngine === 'bigint' ? tvlWethEngine : BigInt(0),
        tvlStethEngine: tvlStethEngine as bigint,
        tvlrEngine: tvlrEngine as bigint,
        senTokenBalance,
        senUSDTokenAllowance,
        senUSDLeftToBorrow: marketDataItem?.marketMaxBorrow as bigint,
        tvlCalculation: tvlCalculation as bigint,
        accountInformation: userData?.[1],
        vaultMintCap: data?.[2],
        senTokenLeftToMint,
        vaultMintedAmount: data?.[3],
        liquidationThreshold: marketDataItem?.maximumCollateralRatio as bigint, //MAX LTV
        interestRate: marketDataItem?.interestPerYear as bigint,
        liquidationBonus: marketDataItem?.liquidationFee as bigint,
        liquidationPrice: liquidationPriceChamber as bigint,
        maxMintable: maxMintable as bigint,
        mintableSenTokens,
        depositedCollateral: userData?.[2],
        updateActiveCollateralToken,
        refetchData,
        calculateMintableTokens,
      }}
    >
      {children}
    </BorrowContext.Provider>
  );
};

export const useBorrowContext = () => {
  return useContext(BorrowContext);
};
