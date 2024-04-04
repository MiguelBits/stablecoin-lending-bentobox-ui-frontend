import {
  Button,
  Grid,
  GridItem,
  Stack,
  useToast,
  Text,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  useContractWrite,
  erc20ABI,
  useWaitForTransaction,
  useAccount,
  useContractRead,
  useSignMessage,
} from 'wagmi';
import { MaxUint256, ethers, formatUnits, parseUnits } from 'ethers';
import BigNumber from 'bignumber.js';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import { recoverMessageAddress } from 'viem';
import { signTypedData } from '@wagmi/core';

import Statistics from 'components/Statistics';
import InfoStat from 'components/InfoStat';

import { useContractContext } from 'contexts/contractContext';
import { useBorrowContext } from 'contexts/borrowContext';

import { useOracleContext } from '@/contexts/oracleContext';
import { useColorContext } from '@/contexts/colorContext';
import useNetwork from '@/hooks/useNetwork';
import { actions } from '@/helpers/actions';

type EngineContracts = {
  [key: string]: {
    address: `0x${string}`;
    abi: any;
  };
};
const BorrowStatistics = ({ isWithdraw }: { isWithdraw: boolean }) => {
  const { activeCollateralAssetPriceFeed } = useOracleContext();
  const { contracts } = useContractContext();
  const { ltvColor, ltvResult } = useColorContext();
  const [isTokenApproved, setTokenApproved] = useState(false);
  const { watch } = useFormContext();
  const collateralAmount = watch('collateralAmount');
  const tokenAmount = watch('tokenAmount');
  const parsedTokenAmount = parseFloat(tokenAmount);
  const { address } = useAccount();
  const chain = useNetwork();
  const toast = useToast();
  const {
    data: signMessageData,
    error,
    isLoading,
    signMessage,
    variables,
  } = useSignMessage();
  const {
    activeCollateralToken,
    collateralTokenBalance,
    collateralTokenAllowance,
    senTokenBalance,
    senUSDTokenAllowance,
    healthFactor,
    accountInformation,
    tvlCalculation,
    minHealthFactor,
    senTokenLeftToMint,
    interestRate,
    feePercentage,
    depositedCollateral,
    liquidationPrice,
    liquidationBonus,
    liquidationThreshold,
    maxMintable,
    mintableSenTokens,
    senUSDLeftToBorrow,
    collateralPrice,
    refetchData,
  } = useBorrowContext();
  const {
    handleSubmit,
    setError,
    reset,
    formState: { isValid },
  } = useFormContext();

  // TODO: understand health factor
  // const isImpactTooHigh = useMemo(() => {
  //   return minHealthFactor && healthFactor &&;
  // }, [minHealthFactor, healthFactor]);

  console.log('liquidation threshol', Number(liquidationThreshold) / 1e18);

  console.log('ltv result', liquidationThreshold);

  const buttonTextBorrow = dynamicButtonTextBorrow();
  const buttonTextWithdraw = dynamicButtonTextWithdraw();
  const buttonTextApprove = dynamicButtonTextApprove();

  function dynamicButtonTextBorrow() {
    if (collateralAmount && tokenAmount) {
      return `BORROW WITH ${activeCollateralToken?.symbol}`;
    } else if (collateralAmount) {
      return `DEPOSIT ${activeCollateralToken?.symbol}`;
    } else if (tokenAmount) {
      return 'Mint senUSD';
    } else {
      return 'Nothing to do';
    }
  }

  function dynamicButtonTextApprove() {
    if (collateralAmount && tokenAmount) {
      return `Approve WITH ${activeCollateralToken?.symbol}`;
    } else if (collateralAmount) {
      return `Approve ${activeCollateralToken?.symbol}`;
    } else if (tokenAmount) {
      return 'Approve senUSD';
    } else {
      return 'Approve';
    }
  }

  function dynamicButtonTextWithdraw() {
    if (collateralAmount && tokenAmount) {
      return `Withdraw WITH ${activeCollateralToken?.symbol}`;
    } else if (collateralAmount) {
      return `Withdraw ${activeCollateralToken?.symbol}`;
    } else if (tokenAmount) {
      return 'Repay senUSD';
    } else {
      return 'Nothing to do';
    }
  }

  const dynamicClickBorrow = () => {
    if (collateralAmount && tokenAmount) {
      onSubmit();
    } else if (collateralAmount) {
      depositCollateral();
    } else if (tokenAmount) {
      mintTokens();
    } else {
    }
  };

  const dynamicClickWithdraw = () => {
    if (collateralAmount && tokenAmount) {
      WithdrawWethAndSENUSD();
    } else if (collateralAmount) {
      redeemCollateral();
    } else if (tokenAmount) {
      repaySenUSD();
    } else {
    }
  };

  const dynamicLoadingBorrow = () => {
    if (collateralAmount && tokenAmount) {
      return isWithdraw
        ? repayAndWithdrawIsLoading || repayAndWithdrawTxIsLoading
        : depositAndMintIsLoading || depositAndMintTxIsLoading;
    } else if (collateralAmount) {
      return isWithdraw
        ? redeemIsLoading || redeemTxIsLoading
        : depositIsLoading || depositTxIsLoading;
    } else if (tokenAmount) {
      return isWithdraw
        ? repayIsLoading || repayTxIsLoading
        : mintIsLoading || mintTxIsLoading;
    } else {
    }
  };

  const dynamicApprovingBorrow = () => {
    if (collateralAmount && tokenAmount) {
      return isWithdraw ? approveSenUSD() : approveStableEngine();
    } else if (collateralAmount) {
      return isWithdraw ? approveSenUSD() : approveStableEngine();
    } else if (tokenAmount) {
      return isWithdraw ? approveSenUSD() : approveStableEngine();
    } else {
    }
  };

  const senUSD = contracts.SENUSD?.address;

  const ENGINE_CONTRACTS: EngineContracts = {
    WETH: contracts.WETH_ENGINE,
    STETH: contracts.STETH_ENGINE,
    RUSDC: contracts.RUSDC_ENGINE,
  };

  // console.log('Active Collateral Token Symbol:', activeCollateralToken?.symbol);
  const selectedEngineContract =
    ENGINE_CONTRACTS[activeCollateralToken?.symbol ?? ''];
  // console.log('Selected Engine Contract:', selectedEngineContract);

  // console.log(
  //   formatUnits(accountInformation?.[0] ?? 0, senTokenBalance?.decimals ?? 0),
  //   '%'
  // );

  const formattedUserMintedAmount = useMemo(() => {
    if (accountInformation) {
      return formatUnits(accountInformation[0], senTokenBalance?.decimals);
    }

    return '';
  }, [accountInformation, senTokenBalance?.decimals]);
  console.log('formattedUserMint', formattedUserMintedAmount);
  console.log('liq', liquidationPrice);

  // Beginning of declaring approve functions ////

  const {
    data: approveStableEngineData,
    writeAsync: approveStableEngine,
    isLoading: approveStableEngineIsLoading,
  } = useContractWrite({
    address: activeCollateralToken?.address,
    abi: erc20ABI,
    functionName: 'approve',
    args: [selectedEngineContract?.address, MaxUint256],
  });

  const { isLoading: approveStableEngineTxIsLoading } = useWaitForTransaction({
    hash: approveStableEngineData?.hash,
    onSuccess: () => {
      // TODO: add toast message
      refetchData();
    },
  });

  const {
    data: approveStableEngineDataSenUSD,
    writeAsync: approveSenUSD,
    isLoading: approveSenUSDIsLoading,
  } = useContractWrite({
    address: senUSD,
    abi: erc20ABI,
    functionName: 'approve',
    args: [contracts.SENBOX?.address, MaxUint256],
  });

  const { isLoading: approveSenUSDTxIsLoading } = useWaitForTransaction({
    hash: approveStableEngineDataSenUSD?.hash,
    onSuccess: () => {
      refetchData();
      reset();
      toast({
        title: 'Approved Successful',
        description: 'You have successfully approved your senUSD token.',
        isClosable: true,
        position: 'top-right',
        status: 'success',
        variant: 'success',
      });
      setTokenApproved(true);
    },
    onError: (err) => {
      console.group('DEPOSIT ERROR');
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
      setTokenApproved(false);
      refetchData();
    },
  });

  const {
    data: approveWithdrawStableEngineData,
    writeAsync: approveWithdrawSenUsd,
    isLoading: approveWithdrawStableEngineDataIsLoading,
  } = useContractWrite({
    address: selectedEngineContract?.address,
    abi: erc20ABI,
    functionName: 'approve',
    args: [senUSD, MaxUint256],
  });

  ///// Beginning of declaring deposits functions AKA BORROW  /////

  /// BORROW WITH COLLATERAL ///

  const {
    data: depositAndMintData,
    writeAsync: depositAndMint,
    isLoading: depositAndMintIsLoading,
  } = useContractWrite({
    ...selectedEngineContract,
    functionName: 'depositCollateralAndMintSenUSD',
  });

  const { isLoading: depositAndMintTxIsLoading } = useWaitForTransaction({
    hash: depositAndMintData?.hash,
    onSuccess: () => {
      refetchData();
      reset();
      toast({
        title: 'Borrow Successful',
        description: 'You have successfully borrowed your tokens.',
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
        title: 'Borrow Failed',
        description: 'Something went wrong.',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      });
    },
  });

  /// FAUCET CLAIM ///
  const {
    data: faucetData,
    writeAsync: claimTokens,
    isLoading: claimTokensIsLoading,
  } = useContractWrite({
    ...contracts.FAUCET,
    functionName: 'requestTokens',
  });

  const { isLoading: claimTokensTxIsLoading } = useWaitForTransaction({
    hash: faucetData?.hash,
    onSuccess: () => {
      refetchData();
      reset();
      toast({
        title: 'Claim Successful',
        description: 'You have successfully claimed your test tokens.',
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
        title: 'Claim Failed',
        description: 'Something went wrong.',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      });
    },
  });

  /// DEPOSIT COLLATERAL ///

  const {
    data: depositData,
    writeAsync: deposit,
    isLoading: depositIsLoading,
  } = useContractWrite({
    ...selectedEngineContract,
    functionName: 'cook',
  });

  const { isLoading: depositTxIsLoading } = useWaitForTransaction({
    hash: depositData?.hash,
    onSuccess: () => {
      refetchData();
      reset();
      toast({
        title: 'Deposit Successful',
        description: 'You have successfully deposited your token.',
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
        title: 'Deposit Failed',
        description: 'Something went wrong',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      });
    },
  });

  /// MINT SENUSD ///

  const {
    data: mintData,
    writeAsync: mint,
    isLoading: mintIsLoading,
  } = useContractWrite({
    ...selectedEngineContract,
    functionName: 'mintSenUSD',
  });

  const { isLoading: mintTxIsLoading } = useWaitForTransaction({
    hash: mintData?.hash,
    onSuccess: () => {
      refetchData();
      reset();
      toast({
        title: 'Mint Successful',
        description: 'You have successfully minted your token.',
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
        title: 'Mint Failed',
        description: 'Something went wrong',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      });
    },
  });

  /// HERE GOES ALL ASYNC FUNCTIONS FROM BORROW ///

  const {
    data: nonceData,
    // refetch: refetchCollateralAllowance,
  } = useContractRead({
    ...contracts.SENBOX,
    functionName: 'nonces',
    args: [address as `0x${string}`],
  });

  console.log('user nonce', nonceData);

  const cookData: {
    events: number[];
    values: number[];
    datas: string[];
  } = {
    events: [],
    values: [],
    datas: [],
  };

  function parseSignature(signature: string) {
    const parsedSignature = signature.substring(2);

    const r = parsedSignature.substring(0, 64);
    const s = parsedSignature.substring(64, 128);
    const v = parsedSignature.substring(128, 130);

    return {
      r: '0x' + r,
      s: '0x' + s,
      v: parseInt(v, 16),
    };
  }
  const abiCoder = new ethers.AbiCoder();
  const dataToDecode =
    '0x000000000000000000000000a48d959ae2e88f1daa7d5f611e01908106de75980000000000000000000000008f6114f3e61b88029fd30f478d544656ed6d0302000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006f05b59d3b20000';
  console.log(
    'decoded data',
    abiCoder.decode(['address', 'address', 'int256', 'int256'], dataToDecode)
  );

  async function handleSigningAndEncoding() {
    if (selectedEngineContract && selectedEngineContract?.address) {
      if (address && selectedEngineContract?.address) {
        const signature = await signTypedData({
          domain: {
            name: 'BentoBox V1',
            chainId: 0x5,
            verifyingContract: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
          },
          message: {
            warning: 'Give FULL access to funds in (and approved to) BentoBox?',
            user: address,
            masterContract: '0x24C3b482Af31ee869fFDAe9ff983123209e256a9',
            approved: true,
            //@ts-ignore nonce data bigint
            nonce: nonceData,
          },
          primaryType: 'SetMasterContractApproval',
          types: {
            SetMasterContractApproval: [
              { name: 'warning', type: 'string' },
              { name: 'user', type: 'address' },
              { name: 'masterContract', type: 'address' },
              { name: 'approved', type: 'bool' },
              { name: 'nonce', type: 'uint256' },
            ],
          },
        });

        
        const parsedSignature = parseSignature(signature);
        console.log("signature", signature);
        console.log('parsedSignature', parsedSignature);

        if (parsedSignature.v === 0) {
          parsedSignature.v = 27;
        }

        if (parsedSignature.v === 1) {
          parsedSignature.v = 28;
        }

        if (parsedSignature !== undefined) {
          const mastercontract: `0x${string}` =
            '0x24C3b482Af31ee869fFDAe9ff983123209e256a9';

          actions.bentoSetApproval(
            cookData,
            address,
            mastercontract,
            true,
            parsedSignature.v,
            parsedSignature.r,
            parsedSignature.s
          );

          // actions.updateExchangeRate(
          //   cookData,
          //   true,
          //   //@ts-ignore hardcoded
          //   0x00,
          //   0x00,
          //   0
          // );

          // const amountToDeposit = 1 * 1e18;
          // actions.bentoDeposit(
          //   cookData,
          //   '0x7A51f19c68181759D4827cB623D70Dfd6110Cab7',
          //   address,
          //   parseUnits('1', senTokenBalance?.decimals),
          //   parseUnits('1', senTokenBalance?.decimals),
          //   0
          // );

          // actions.addCollateral(
          //   cookData,
          //   parseUnits('1', senTokenBalance?.decimals),
          //   address,
          //   false
          // );

          console.log('value v:', parsedSignature.v);
          console.log('value r:', parsedSignature.r);
          console.log('value s:', parsedSignature.s);
          console.log('parsedSignature', parsedSignature);
          console.log('address:', address);
          console.log(
            'selectedEngineContract?.address:',
            selectedEngineContract?.address
          );

          console.log('Encoded Data:', cookData);
        } else {
          console.error('Invalid v, r, or s value');
        }
      } else {
        console.error('Account or selectedEngineContract address is undefined');
      }
    }
  }

  async function handleBorrowAndEncoding() {
    if (selectedEngineContract && selectedEngineContract?.address) {
      if (address && selectedEngineContract?.address) {
        const signature = await signTypedData({
          domain: {
            name: 'BentoBox V1',
            chainId: 0x5,
            verifyingContract: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
          },
          message: {
            warning: 'Give FULL access to funds in (and approved to) BentoBox?',
            user: address,
            masterContract: '0x24C3b482Af31ee869fFDAe9ff983123209e256a9',
            approved: true,
            //@ts-ignore nonce data bigint
            nonce: nonceData,
          },
          primaryType: 'SetMasterContractApproval',
          types: {
            SetMasterContractApproval: [
              { name: 'warning', type: 'string' },
              { name: 'user', type: 'address' },
              { name: 'masterContract', type: 'address' },
              { name: 'approved', type: 'bool' },
              { name: 'nonce', type: 'uint256' },
            ],
          },
        });

        const parsedSignature = parseSignature(signature);

        if (parsedSignature.v === 0) {
          parsedSignature.v = 27;
        }

        if (parsedSignature.v === 1) {
          parsedSignature.v = 28;
        }

        if (parsedSignature !== undefined) {
          const mastercontract: `0x${string}` =
            '0x24C3b482Af31ee869fFDAe9ff983123209e256a9';

          actions.bentoSetApproval(
            cookData,
            address,
            mastercontract,
            true,
            parsedSignature.v,
            parsedSignature.r,
            parsedSignature.s
          );

          actions.updateExchangeRate(
            cookData,
            false,
            //@ts-ignore hardcoded
            0x00,
            0x00,
            0
          );

          actions.borrow(
            cookData,
            parseUnits('1', senTokenBalance?.decimals),
            address
          );

          actions.bentoWithdraw(
            cookData,
            '0xd0D421Fa19fde0bfD1f54a7E17b625d47332f216',
            address,
            parseUnits('1', senTokenBalance?.decimals),
            parseUnits('1', senTokenBalance?.decimals),
            0
          );

          console.log('value v:', parsedSignature.v);
          console.log('value r:', parsedSignature.r);
          console.log('value s:', parsedSignature.s);
          console.log('parsedSignature', parsedSignature);
          console.log('address:', address);
          console.log(
            'selectedEngineContract?.address:',
            selectedEngineContract?.address
          );

          console.log('Encoded Data:', cookData);
        } else {
          console.error('Invalid v, r, or s value');
        }
      } else {
        console.error('Account or selectedEngineContract address is undefined');
      }
    }
  }

  async function handleRepayAndEncoding() {
    if (selectedEngineContract && selectedEngineContract?.address) {
      if (address && selectedEngineContract?.address) {
        const signature = await signTypedData({
          domain: {
            name: 'BentoBox V1',
            chainId: 0x5,
            verifyingContract: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
          },
          message: {
            warning: 'Give FULL access to funds in (and approved to) BentoBox?',
            user: address,
            masterContract: '0x24C3b482Af31ee869fFDAe9ff983123209e256a9',
            approved: true,
            //@ts-ignore nonce data bigint
            nonce: nonceData,
          },
          primaryType: 'SetMasterContractApproval',
          types: {
            SetMasterContractApproval: [
              { name: 'warning', type: 'string' },
              { name: 'user', type: 'address' },
              { name: 'masterContract', type: 'address' },
              { name: 'approved', type: 'bool' },
              { name: 'nonce', type: 'uint256' },
            ],
          },
        });

        const parsedSignature = parseSignature(signature);

        if (parsedSignature.v === 0) {
          parsedSignature.v = 27;
        }

        if (parsedSignature.v === 1) {
          parsedSignature.v = 28;
        }

        if (parsedSignature !== undefined) {
          const mastercontract: `0x${string}` =
            '0x24C3b482Af31ee869fFDAe9ff983123209e256a9';

          actions.bentoSetApproval(
            cookData,
            address,
            mastercontract,
            true,
            parsedSignature.v,
            parsedSignature.r,
            parsedSignature.s
          );

          actions.updateExchangeRate(
            cookData,
            false,
            //@ts-ignore hardcoded
            0x00,
            0x00,
            0
          );

          actions.bentoDeposit(
            cookData,
            '0xd0D421Fa19fde0bfD1f54a7E17b625d47332f216',
            address,
            parseUnits('1', senTokenBalance?.decimals),
            parseUnits('0', senTokenBalance?.decimals)
          );

          actions.getRepayPart(
            cookData,
            parseUnits('1', senTokenBalance?.decimals),
            0
          );

          actions.repay(
            cookData,
            parseUnits('1', senTokenBalance?.decimals),
            address,
            false
          );

          console.log('value v:', parsedSignature.v);
          console.log('value r:', parsedSignature.r);
          console.log('value s:', parsedSignature.s);
          console.log('parsedSignature', parsedSignature);
          console.log('address:', address);
          console.log(
            'selectedEngineContract?.address:',
            selectedEngineContract?.address
          );

          console.log('Encoded Data:', cookData);
        } else {
          console.error('Invalid v, r, or s value');
        }
      } else {
        console.error('Account or selectedEngineContract address is undefined');
      }
    }
  }

  async function handleWithdrawAndEncoding() {
    if (selectedEngineContract && selectedEngineContract?.address) {
      if (address && selectedEngineContract?.address) {
        const signature = await signTypedData({
          domain: {
            name: 'BentoBox V1',
            chainId: 0x5,
            verifyingContract: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
          },
          message: {
            warning: 'Give FULL access to funds in (and approved to) BentoBox?',
            user: address,
            masterContract: '0x24C3b482Af31ee869fFDAe9ff983123209e256a9',
            approved: true,
            //@ts-ignore nonce data bigint
            nonce: nonceData,
          },
          primaryType: 'SetMasterContractApproval',
          types: {
            SetMasterContractApproval: [
              { name: 'warning', type: 'string' },
              { name: 'user', type: 'address' },
              { name: 'masterContract', type: 'address' },
              { name: 'approved', type: 'bool' },
              { name: 'nonce', type: 'uint256' },
            ],
          },
        });

        const parsedSignature = parseSignature(signature);

        if (parsedSignature.v === 0) {
          parsedSignature.v = 27;
        }

        if (parsedSignature.v === 1) {
          parsedSignature.v = 28;
        }

        if (parsedSignature !== undefined) {
          const mastercontract: `0x${string}` =
            '0x24C3b482Af31ee869fFDAe9ff983123209e256a9';

          actions.bentoSetApproval(
            cookData,
            address,
            mastercontract,
            true,
            parsedSignature.v,
            parsedSignature.r,
            parsedSignature.s
          );

          actions.updateExchangeRate(
            cookData,
            false,
            //@ts-ignore hardcoded
            0x00,
            0x00,
            0
          );

          actions.removeCollateral(
            cookData,
            parseUnits('1', senTokenBalance?.decimals),
            address
          );

          actions.bentoWithdraw(
            cookData,
            '0x7A51f19c68181759D4827cB623D70Dfd6110Cab7',
            address,
            0,
            parseUnits('1', senTokenBalance?.decimals)
          );

          console.log('value v:', parsedSignature.v);
          console.log('value r:', parsedSignature.r);
          console.log('value s:', parsedSignature.s);
          console.log('parsedSignature', parsedSignature);
          console.log('address:', address);
          console.log(
            'selectedEngineContract?.address:',
            selectedEngineContract?.address
          );

          console.log('Encoded Data:', cookData);
        } else {
          console.error('Invalid v, r, or s value');
        }
      } else {
        console.error('Account or selectedEngineContract address is undefined');
      }
    }
  }

  const depositCollateral = handleSubmit(async (data: any) => {
    if (!data || !data.collateralAmount) {
      console.error('collateralAmount is missing or undefined');
      return;
    }

    if (Number.isNaN(Number(data.collateralAmount))) {
      setError('collateralAmount', {
        type: 'pattern',
        message: 'Current value is not a number',
      });
      return;
    } else if (Number(data.collateralAmount) <= 0) {
      setError('collateralAmount', {
        type: 'min',
        message: 'Value cannot be a negative number or 0',
      });
      return;
    }
    await handleSigningAndEncoding();
    // await handleBorrowAndEncoding();
    // await handleRepayAndEncoding();
    // await handleWithdrawAndEncoding();
    console.log('Encoded Data Within Encoding and signing:', cookData);
    deposit({
      args: [cookData.events, cookData.values, cookData.datas],
    });
  });

  const mintTokens = handleSubmit(async (data: any) => {
    if (!data || !data.tokenAmount) {
      console.error('tokenAmount is missing or undefined');
      return;
    }

    if (Number.isNaN(Number(data.tokenAmount))) {
      setError('tokenAmount', {
        type: 'pattern',
        message: 'Current value is not a number',
      });
      return;
    } else if (Number(data.tokenAmount) <= 0) {
      setError('tokenAmount', {
        type: 'min',
        message: 'Value cannot be a negative number or 0',
      });
      return;
    }
    mint({
      args: [parseUnits(data.tokenAmount, senTokenBalance?.decimals)],
    });
  });

  // eslint-disable-next-line
  let testingValue: Number = 1;
  // eslint-disable-next-line
  let mintValue: Number = 1;
  const onSubmit = handleSubmit(async (data) => {
    if (Number.isNaN(Number(data.collateralAmount))) {
      setError('collateralAmount', {
        type: 'pattern',
        message: 'Current value is not a number',
      });
    } else if (Number(data.collateralAmount) <= 0) {
      setError('collateralAmount', {
        type: 'min',
        message: 'Value cannot be a negative number or 0',
      });
    }
    if (Number.isNaN(Number(data.tokenAmount))) {
      setError('tokenAmount', {
        type: 'pattern',
        message: 'Current value is not a number',
      });
      return;
    } else if (Number(data.tokenAmount) <= 0) {
      setError('tokenAmount', {
        type: 'min',
        message: 'Value cannot be a negative number or 0',
      });
      return;
    }
    mint({
      args: [parseUnits(data.tokenAmount, senTokenBalance?.decimals)],
    });
    testingValue = data.tokenAmount;
    mintValue = data.collateralAmount;
    await depositAndMint({
      args: [
        activeCollateralToken?.address,
        parseUnits(data.collateralAmount, collateralTokenBalance?.decimals),
        parseUnits(data.tokenAmount, senTokenBalance?.decimals),
      ],
    });
  });

  // console.log('activeCollateral', activeCollateralAssetPriceFeed);
  // console.log(senTokenLeftToMint?.formatted);

  //Claim from faucet on submit handling
  // eslint-disable-next-line no-unused-vars
  const faucetClaim = handleSubmit(async () => {
    try {
      await claimTokens();
    } catch (err) {
      toast({
        title: 'Claim Failed',
        description: 'An error occurred while claiming tokens.',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      });
    }
  });

  ///// Beginning of declaring withdraw functions /////

  /// WITHDRAW COLLATERAL ///

  const {
    data: redeemData,
    writeAsync: withdrawAndRedeem,
    isLoading: redeemIsLoading,
  } = useContractWrite({
    ...selectedEngineContract,
    functionName: 'redeemCollateral',
  });

  const { isLoading: redeemTxIsLoading } = useWaitForTransaction({
    hash: redeemData?.hash,
    onSuccess: () => {
      refetchData();
      reset();
      toast({
        title: 'Withdraw Successful',
        description: 'You have successfully withdraw your token.',
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
        title: 'Withdraw Failed',
        description: 'Something went wrong',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      });
    },
  });

  /// REPAY SENUSD ///

  const {
    data: repayData,
    writeAsync: repay,
    isLoading: repayIsLoading,
  } = useContractWrite({
    ...selectedEngineContract,
    functionName: 'burnSenUSD',
  });

  const { isLoading: repayTxIsLoading } = useWaitForTransaction({
    hash: repayData?.hash,
    onSuccess: () => {
      refetchData();
      reset();
      toast({
        title: 'Repaid Successful',
        description: 'You have successfully repaid your token.',
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
        title: 'Repaid Failed',
        description: 'Something went wrong',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      });
    },
  });

  /// WITHDRAW WITH WETH ///

  const {
    data: repayAndWithdrawData,
    writeAsync: repayAndWithdraw,
    isLoading: repayAndWithdrawIsLoading,
  } = useContractWrite({
    ...selectedEngineContract,
    functionName: 'redeemCollateralForSenUSD',
  });

  const { isLoading: repayAndWithdrawTxIsLoading } = useWaitForTransaction({
    hash: repayAndWithdrawData?.hash,
    onSuccess: () => {
      refetchData();
      reset();
      toast({
        title: 'Withdraw Successful',
        description: 'You have successfully withdraw your tokens.',
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
        title: 'Withdraw Failed',
        description: 'Something went wrong',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      });
    },
  });

  /// HERE GOES ALL ASYNC FUNCTIONS FROM WITHDRAW ///

  const redeemCollateral = handleSubmit(async (data: any) => {
    if (!data || !data.collateralAmount) {
      console.error('collateralAmount is missing or undefined');
      return;
    }

    if (Number.isNaN(Number(data.collateralAmount))) {
      setError('collateralAmount', {
        type: 'pattern',
        message: 'Current value is not a number',
      });
      return;
    } else if (Number(data.collateralAmount) <= 0) {
      setError('collateralAmount', {
        type: 'min',
        message: 'Value cannot be a negative number or 0',
      });
      return;
    }
    withdrawAndRedeem({
      args: [
        activeCollateralToken?.address,
        parseUnits(data.collateralAmount, collateralTokenBalance?.decimals),
      ],
    });
  });
  // console.log('reedemCollateral', collateralTokenBalance);

  const repaySenUSD = handleSubmit(async (data: any) => {
    if (!data || !data.tokenAmount) {
      console.error('tokenAmount is missing or undefined');
      return;
    }

    if (Number.isNaN(Number(data.tokenAmount))) {
      setError('tokenAmount', {
        type: 'pattern',
        message: 'Current value is not a number',
      });
      return;
    } else if (Number(data.tokenAmount) <= 0) {
      setError('tokenAmount', {
        type: 'min',
        message: 'Value cannot be a negative number or 0',
      });
      return;
    }
    repay({
      args: [parseUnits(data.tokenAmount, senTokenBalance?.decimals)],
    });
  });
  // console.log('reedemCollateral', collateralTokenBalance);

  const WithdrawWethAndSENUSD = handleSubmit(async (data) => {
    if (Number.isNaN(Number(data.collateralAmount))) {
      setError('collateralAmount', {
        type: 'pattern',
        message: 'Current value is not a number',
      });
    } else if (Number(data.collateralAmount) <= 0) {
      setError('collateralAmount', {
        type: 'min',
        message: 'Value cannot be a negative number or 0',
      });
    }
    testingValue = data.tokenAmount;
    mintValue = data.collateralAmount;
    await repayAndWithdraw({
      args: [
        activeCollateralToken?.address,
        parseUnits(data.collateralAmount, collateralTokenBalance?.decimals),
        parseUnits(data.tokenAmount, senTokenBalance?.decimals),
      ],
    });
  });

  const accountInfoBigInt = BigInt(accountInformation?.[1]?.toString() || '0');
  const depositedCollateralBigInt = depositedCollateral
    ? BigInt(Number(depositedCollateral))
    : BigInt(0);

  // Multiply before dividing to avoid fractions

  const priceOfCollateralBigInt =
    depositedCollateralBigInt !== BigInt(0)
      ? (accountInfoBigInt * BigInt(1e18)) / depositedCollateralBigInt
      : BigInt(0);

  //console.log('price', priceOfCollateralBigInt);

  // const [whole, fraction = ''] = String(testingValue).split('.');

  // const testingValueBigInt = BigInt(whole + fraction.padEnd(18, '0'));

  // const mintTokens = async () => {
  //   console.log('mint TOken', Number(priceOfCollateralBigInt));
  //   mint({
  //     args: [Number(testingValueBigInt) / 1e2],
  //   });
  // };
  type LiquidationResult = {
    liquidatorProfit: number;
    remainingCollateralTokens: number;
    liquidationPrice: number;
  };
  function calculateLiquidation(): LiquidationResult {
    const price = Number(priceOfCollateralBigInt) / 1e18;
    const collateralValue = Number(depositedCollateral) * price;
    const currentCollateralRatio =
      Number(formattedUserMintedAmount) / collateralValue;

    const liquidationPrice =
      Number(formattedUserMintedAmount) / (Number(depositedCollateral) * 0.5);
    if (currentCollateralRatio > 0.5) {
      // CDP gets liquidated
      const tokensForDebt = Number(formattedUserMintedAmount) / price;
      //@ts-ignore  There's an issue with this specific line, and we're ignoring it for now.
      const bonusTokens = tokensForDebt * feePercentage;
      const totalLiquidatorTokens = tokensForDebt + bonusTokens;
      const remainingCollateralTokens =
        Number(depositedCollateral) - totalLiquidatorTokens;
      const liquidatorProfitValue =
        totalLiquidatorTokens * price - Number(formattedUserMintedAmount);

      return {
        liquidatorProfit: liquidatorProfitValue,
        remainingCollateralTokens: remainingCollateralTokens,
        liquidationPrice: liquidationPrice,
      };
    } else {
      // CDP is safe, so no liquidation
      return {
        liquidatorProfit: 0,
        remainingCollateralTokens: Number(depositedCollateral),
        liquidationPrice: liquidationPrice,
      };
    }
  }

  function calculateLiquidationPriceContract(
    totalSenUSDDebt: BigNumber,
    collateralValueInUsd: BigNumber,
    liquidationThreshold: BigNumber
  ): BigNumber {
    if (totalSenUSDDebt.isEqualTo(0) || collateralValueInUsd.isEqualTo(0)) {
      return new BigNumber(0);
    }

    const debtPart = totalSenUSDDebt
      .multipliedBy(new BigNumber(1e18))
      .dividedBy(collateralValueInUsd);
    const thresholdPart = debtPart
      .multipliedBy(liquidationThreshold)
      .dividedBy(new BigNumber(1e18));

    return collateralValueInUsd.minus(thresholdPart);
  }
  const ethToUsd = Number(priceOfCollateralBigInt) / 1e18;
  const formattedDeposited = Number(depositedCollateral) / 1e18;
  const collateral = Number(collateralAmount) + formattedDeposited;
  const collateralOnly = Number(collateralAmount) + 0;
  const collateralValueInUsd = collateral * ethToUsd;
  const collateralValueInUsdStatic = formattedDeposited * ethToUsd;
  const accountInfo = accountInformation?.[0];
  const collateralValueInUsdWithdraw = collateralOnly * ethToUsd;
  const subtractCollateralValue =
    Number(collateralValueInUsdStatic) - Number(collateralValueInUsdWithdraw);
  const finalCollateralValueSubstract = Math.max(subtractCollateralValue, 0);

  let liqprice;
  if (accountInfo !== undefined) {
    liqprice = calculateLiquidationPriceContract(
      new BigNumber(accountInfo.toString()),
      new BigNumber(collateralValueInUsd.toString()),
      new BigNumber(
        liquidationThreshold ? liquidationThreshold.toString() : '0'
      )
    );
  } else {
    console.log('accountInformation[0] is undefined');
  }

  console.log('totalSenUSDDebt', accountInfo?.toString());
  console.log('collateralValueInUSD', collateralValueInUsd / 1e18);
  console.log('liq', liqprice?.toString());

  console.log('ethToUsd', ethToUsd);
  console.log('collateralValueInUsd', collateralValueInUsd);
  const formattedThreshold = Number(liquidationThreshold);
  const maxBorrowableInUsd = collateralValueInUsd * Number(formattedThreshold);
  const alreadyBorrowedInUsd = Number(formattedUserMintedAmount).toFixed(2);
  //@ts-ignore for building
  const remainingBorrowableInUsd = maxBorrowableInUsd - alreadyBorrowedInUsd;
  let remainingBorrowableInEth = remainingBorrowableInUsd / ethToUsd;
  if (isWithdraw) {
    remainingBorrowableInEth = Math.max(
      0,
      remainingBorrowableInEth - Number(collateralAmount)
    );
  }

  const formattedRemainingBorrowableInEth = isNaN(remainingBorrowableInEth)
    ? '0.000000'
    : remainingBorrowableInEth.toFixed(6);

  function ltvCalculator(borrowed: number, collateralValue: number): number {
    const ltv = borrowed / collateralValue;
    return ltv;
  }

  const fixedDeposit = !isWithdraw
    ? Number(depositedCollateral) / 1e18 + Number(collateralAmount)
    : Math.max(
        0,
        Number(depositedCollateral) / 1e18 - Number(collateralAmount)
      );

  const formatteFixedDepositValue = isNaN(fixedDeposit)
    ? 0
    : fixedDeposit.toFixed(4);

  const dynamicMintedTokenAmount = !isWithdraw
    ? Number(tokenAmount) + Number(formattedUserMintedAmount)
    : Math.max(0, Number(formattedUserMintedAmount) - Number(tokenAmount));
  console.log('minted with isWithdraw', dynamicMintedTokenAmount);

  const dynamicLiquidation =
    dynamicMintedTokenAmount /
    Number(formattedThreshold) /
    Number(formatteFixedDepositValue);
  const maxMintableNumber = Number(maxMintable) / 1e18;
  const maxMintableFormatted = isNaN(maxMintableNumber) ? 0 : maxMintableNumber;
  console.log('depositedCol', Number(depositedCollateral) / 1e18);
  console.log(
    'LTV',
    ltvCalculator(Number(formattedUserMintedAmount), collateralValueInUsd)
  );

  console.log('formatted threshold', formattedThreshold);
  console.log('dynamic minted token amount', dynamicMintedTokenAmount);
  console.log('collateral value in usd', collateralValueInUsd);
  console.log('dynamic price liq', dynamicLiquidation);

  const { data: dataGetEngineInfo } = useContractRead({
    ...selectedEngineContract,
    functionName: 'getEngineInfo',
  });

  const newSenTokenLeftToMint = Number(dataGetEngineInfo?.[4]) / 1e18;

  //for pushing...

  return (
    <>
      <GridItem
        order={[2, 2, 2, 2, '0.501vw']}
        colSpan={2}
        px={[5, 8, '2.005vw']}
        py={[6, 6, '1.504vw']}
        borderLeft="1px solid rgba(232, 185, 106, 0.12)"
      >
        <Grid templateColumns="repeat(2, 1fr)">
          <GridItem>
            <Grid
              templateColumns={['1fr', '1fr', 'repeat(2, 1fr)']}
              gap={[3, 3, 2, '0.501vw']}
            >
              <GridItem
                display="flex"
                alignItems={['center', 'center', 'flex-start']}
                justifyContent={['center', 'center', 'flex-start']}
                textAlign={['center', 'center', 'start']}
              >
                <Statistics
                  label="Collateral Deposit"
                  value={formatteFixedDepositValue}
                />
              </GridItem>
              <GridItem
                display="flex"
                alignItems={['center', 'center', 'flex-start']}
                justifyContent={['center', 'center', 'flex-start']}
                textAlign={['center', 'center', 'start']}
              >
                <Statistics
                  label="Liquidation Price"
                  value={
                    isNaN(Number(dynamicLiquidation))
                      ? 0
                      : Number(dynamicLiquidation).toFixed(4) ||
                        Number(liqprice?.toString()) / 1e18
                  }
                  color={ltvColor}
                />
              </GridItem>
            </Grid>
          </GridItem>

          <GridItem>
            <Grid
              templateColumns={['1fr', '1fr', 'repeat(2, 1fr)']}
              gap={[3, 3, 2, '0.501vw']}
            >
              <GridItem
                display="flex"
                alignItems={['center', 'center', 'flex-start']}
                justifyContent={['center', 'center', 'flex-start']}
                textAlign={['center', 'center', 'start']}
              >
                <Statistics
                  label="senUSD Borrowed"
                  value={Number(dynamicMintedTokenAmount).toFixed(2)}
                />
              </GridItem>
              <GridItem
                display="flex"
                alignItems="center"
                justifyContent={['center', 'center', 'flex-start']}
                textAlign={['center', 'center', 'start']}
              >
                <Statistics
                  label="senUSD left"
                  value={Number(maxMintableFormatted).toFixed(2)}
                />
              </GridItem>
              {/* <GridItem
                display="flex"
                alignItems="center"
                justifyContent={['center', 'center', 'flex-start']}
                textAlign={['center', 'center', 'start']}
              >
                <Statistics label="Collateral Value" value="TODO" />
              </GridItem> */}
            </Grid>
          </GridItem>
        </Grid>

        <Stack spacing={[3, 3, '0.752vw']} mt={[6, 6, '1.504vw']}>
          <InfoStat
            tooltipLabel="USD Value of the Collateral Deposited in your Position"
            label="Collateral Value:"
            value={
              isWithdraw
                ? `$ ${
                    accountInformation &&
                    !isNaN(Number(collateralValueInUsdWithdraw))
                      ? Number(finalCollateralValueSubstract).toFixed(2)
                      : '0.00'
                  }`
                : `$ ${
                    accountInformation && !isNaN(Number(collateralValueInUsd))
                      ? Number(collateralValueInUsd).toFixed(2)
                      : '0.00'
                  }`
            }
          />
          <InfoStat
            tooltipLabel="Total Value Locked"
            label="TVL:"
            value={`$${Number(Number(tvlCalculation) / 1e18).toFixed(2)}`}
          />
          {/* <InfoStat
            tooltipLabel="Amount of Seneca minted"
            label="Minted Seneca:"
            value={`${
              accountInformation &&
              formatUnits(
                (accountInformation as bigint[])[0].toString(),
                senTokenBalance?.decimals
              )
            }`}
          /> */}
          <InfoStat
            tooltipLabel="senUSD tokens that you can still mint"
            label="senUSD Left To Borrow:"
            // value={Number(senTokenLeftToMint?.formatted).toFixed(2)}
            value={`${Number(senUSDLeftToBorrow) / 1e18}`}
          />
          <InfoStat
            tooltipLabel="Withdrawable Collateral"
            label="Withdrawable Collateral:"
            value={`${formattedRemainingBorrowableInEth}`}
          />
          {/* <Flex alignItems="center" justifyContent="space-between">
            <Flex

              alignItems={['flex-start', 'flex-start', 'center']}
              justifyContent={['flex-start', 'flex-start', 'space-between']}
              w="full"
              flex="0.5"
              flexDirection={['column', 'column', 'row']}
            ></Flex>
            <Text color="text.secondary" fontSize={['sm', 'sm', '0.877vw']}>
              {senTokenBalance?.formatted}
            </Text>
          </Flex> */}

          <Stack
            mt={[4, 4, '1.003vw']}
            direction={['column', 'column', 'row']}
            spacing={[4, 4, '1.003vw']}
          >
            {Number(collateralTokenAllowance) > 0 ? (
              <Stack w="full">
                <Stack direction={['column', 'column', 'row']} w="full">
                  {/* {isWithdraw ? (
                    <Button
                      variant="brandYellowFill"
                      w="full"
                      type="button"
                      onClick={redeemCollateral}
                      isDisabled={!isValid}
                      isLoading={redeemIsLoading || redeemTxIsLoading}
                    >
                      WITHDRAW {activeCollateralToken?.symbol}
                    </Button>
                  ) : (
                    <Button
                      variant="brandYellowFill"
                      w="full"
                      type="button"
                      isDisabled={!isValid}
                      onClick={depositCollateral}
                      isLoading={depositIsLoading || depositTxIsLoading}
                    >
                      DEPOSIT {activeCollateralToken?.symbol}
                    </Button>
                  )} */}
                  <Button
                    variant="brandYellowFill"
                    w="full"
                    type="button"
                    onClick={() => {
                      return dynamicApprovingBorrow();
                    }}
                    isLoading={
                      isWithdraw
                        ? approveStableEngineIsLoading ||
                          approveStableEngineTxIsLoading
                        : approveSenUSDIsLoading || approveSenUSDTxIsLoading
                    }
                    isDisabled={
                      !isWithdraw
                        ? Number(collateralTokenAllowance) > 0
                        : Number(senUSDTokenAllowance) > 0
                    }
                  >
                    {buttonTextApprove}
                  </Button>
                  {/* <Button
                    variant="brandYellowFill"
                    w={['full', 'full', 'full']}
                    px={[12, 12, '3.008vw']}
                    isDisabled={
                      Number(senTokenLeftToMint) <= 0 ||
                      (minHealthFactor as bigint) > (healthFactor as bigint)
                    }
                    onClick={() => {
                      if (
                        Number(
                          senUSDTokenAllowance !== undefined &&
                            senUSDTokenAllowance > 0
                        )
                      ) {
                        if (isWithdraw) {
                          repaySenUSD();
                        } else {
                          mintTokens();
                        }
                      } else {
                        return approveSenUSD();
                      }
                    }}
                    isLoading={
                      senUSDTokenAllowance !== undefined &&
                      senUSDTokenAllowance > 0
                        ? (isWithdraw ? repayIsLoading : mintIsLoading) ||
                          (isWithdraw ? repayTxIsLoading : mintTxIsLoading)
                        : approveSenUSDIsLoading || approveSenUSDTxIsLoading
                    }
                  >
                    {isWithdraw ? 'REPAY' : 'MINT'} SenUSD
                  </Button> */}
                  <Button
                    variant="brandYellowFill"
                    w={['full', 'full', 'full']}
                    px={[12, 12, '3.008vw']}
                    onClick={
                      isWithdraw ? dynamicClickWithdraw : dynamicClickBorrow
                    }
                    isLoading={dynamicLoadingBorrow()}
                    isDisabled={
                      (isWithdraw && Number(senUSDTokenAllowance) <= 0) ||
                      ltvResult >= (Number(liquidationThreshold) / 1e18) * 100
                    }
                  >
                    {isWithdraw ? buttonTextWithdraw : buttonTextBorrow}
                  </Button>
                </Stack>
                {/* <Button
                  variant="brandYellowFill"
                  w={['full', 'full', 'full']}
                  px={[12, 12, '3.008vw']}
                  onClick={() => {
                    if (isWithdraw) {
                      WithdrawWethAndSENUSD();
                    } else {
                      onSubmit();
                    }
                  }}
                  isDisabled={!isValid}
                  // onClick={mintTokens}
                  isLoading={
                    (isWithdraw
                      ? repayAndWithdrawIsLoading
                      : depositAndMintIsLoading) ||
                    (isWithdraw
                      ? repayAndWithdrawTxIsLoading
                      : depositAndMintTxIsLoading)
                  }
                >
                  {isWithdraw ? 'WITHDRAW' : 'BORROW'} WITH{' '}
                  {activeCollateralToken?.symbol}
                </Button> */}
                <Button
                  variant="brandYellowFill"
                  w={['full', 'full', 'full']}
                  px={[12, 12, '3.008vw']}
                  onClick={faucetClaim}
                  isLoading={claimTokensIsLoading || claimTokensTxIsLoading}
                >
                  Claim test tokens
                </Button>
                {/* <Button
                  variant="brandYellowFill"
                  w="full"
                  type="button"
                  onClick={() => {
                    return dynamicApprovingBorrow();
                  }}
                  isLoading={
                    approveStableEngineIsLoading ||
                    approveStableEngineTxIsLoading
                  }
                  isDisabled={
                    !isWithdraw
                      ? Number(collateralTokenAllowance) > 0
                      : Number(senUSDTokenAllowance) > 0
                  }
                >
                  {buttonTextApprove}
                </Button> */}
                THIS BUTTON IS FOR TESTING PURPOSES
                {/* <Button
                  variant="brandYellowFill"
                  w="full"
                  type="button"
                  onClick={() => {
                    return dynamicApprovingBorrow();
                  }}
                  isLoading={
                    approveStableEngineIsLoading ||
                    approveStableEngineTxIsLoading
                  }
                  // isDisabled={
                  //   Number(collateralTokenAllowance && senUSDTokenAllowance) > 0
                  // }
                >
                  {buttonTextApprove}
                </Button> */}
              </Stack>
            ) : (
              <Button
                variant="brandYellowFill"
                w="full"
                type="button"
                onClick={() => {
                  return approveStableEngine();
                }}
                isLoading={
                  approveStableEngineIsLoading || approveStableEngineTxIsLoading
                }
              >
                APPROVE {activeCollateralToken?.symbol}
              </Button>
            )}
          </Stack>
        </Stack>
      </GridItem>

      <GridItem
        order={['3', '3', '3', '3']}
        colSpan={2}
        px={[5, 8, '2.005vw']}
        py={[6, 6, '1.504vw']}
        borderTop="1px solid rgba(232, 185, 106, 0.12)"
      >
        <Stack spacing={[10, 10, '2.506vw']}>
          <Stack spacing={[3, 3, '0.752vw']}>
            <InfoStat
              tooltipLabel="Maximum collateral ratio (MCR): MCR represents the maximum amount of debt a user can borrow with a selected collateral token."
              label="Maximum collateral ratio:"
              value={`${formattedThreshold / 100}%`}
            />
            <InfoStat
              tooltipLabel="This is the discount a liquidator gets when buying collateral flagged for liquidation."
              label="Liquidation fee:"
              value={`${Number(liquidationBonus) / 100}%`}
            />
            <InfoStat
              tooltipLabel="This fee is added to your debt everytime you borrow senUSD"
              label="Borrow fee:"
              value={`${Number(feePercentage) / 100}%`}
            />
            <InfoStat
              tooltipLabel="This is the annualized percent that your debt will increase each year."
              label="Interest:"
              value={`${Number(interestRate) / 100}%`}
            />
            <InfoStat
              tooltipLabel="Price of one collateral token"
              label="Price:"
              value={`$${Number(collateralPrice) / 1e18}`}
            />
          </Stack>
          <InfoStat
            label="Your senUSD LEFT TO BORROW"
            value={Number(maxMintableFormatted).toFixed(2)}
            color="brand.secondary"
          />
        </Stack>
      </GridItem>
    </>
  );
};

export default BorrowStatistics;
