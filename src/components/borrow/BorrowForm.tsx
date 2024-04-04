import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useRadioGroup,
  FormErrorMessage,
  useDisclosure,
  InputRightElement,
  Button,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
  NumberInput,
  NumberInputField,
  useToken,
  InputLeftAddon,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import { formatUnits } from 'ethers';
import hexToRgba from 'hex-to-rgba';

import CustomRadio from 'components/CustomRadio';
import InfoStat from 'components/InfoStat';
import CustomRadioButton from 'components/CustomRadioButton';

import { useBorrowContext } from 'contexts/borrowContext';

import { networkOptions } from 'constants/network';

import TokenLogo from 'assets/logos/token-logo.svg';

import WalletBalanceInfo from 'app/sendashboard/borrow/_components/WalletBalanceInfo';
import CollateralAssetsMenu from 'app/sendashboard/borrow/_components/CollateralAssetMenu';
import CustomTokenValueModal from 'app/sendashboard/borrow/_modals/CustomTokenValueModal';
import { useColorContext } from '@/contexts/colorContext';

const BorrowForm = ({ isWithdraw }: { isWithdraw: boolean }) => {
  const {
    collateralTokenBalance,
    activeCollateralToken,
    liquidationThreshold,
    senTokenBalance,
    mintableSenTokens,
    accountInformation,
    senTokenLeftToMint,
    depositedCollateral,
    calculateMintableTokens,
  } = useBorrowContext();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCustomActive, setIsCustomActive] = useState(false);
  const [previousCollateralAmount, setPreviousCollateralAmount] = useState('');
  const [previousTokenAmount, setPreviousTokenAmount] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('0');
  const decimals = senTokenBalance?.decimals || 18;
  const { ltvColor, setLtvColor, setLtvResult } = useColorContext();
  const [brandSecondary] = useToken('colors', ['brand.secondary']);
  const [percentageValue, setPercentageValue] = useState(0);
  const [desiredLTV, setDesiredLTV] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    watch,
  } = useFormContext();

  const { getRadioProps: getNetworkRadioProps } = useRadioGroup({
    name: 'networkOptions',
    defaultValue: 'ETH',
  });

  const {
    getRadioProps: getCollateralPercentageRadioProps,
    setValue: setPercentageWalletValue,
  } = useRadioGroup({
    name: '0.25',
    defaultValue: radioValue,
    onChange: (data) => {
      if (isWithdraw) {
        const partialCollateralAssetAmount =
          Number(data) * Number(formattedRemainingBorrowableInEth);

        setIsCustomActive(false);

        const partialCollateralAssetAmountBigN = new BigNumber(
          partialCollateralAssetAmount
        );

        return setValue(
          'collateralAmount',
          partialCollateralAssetAmountBigN.toString(),
          {
            shouldValidate: true,
          }
        );
      } else {
        const partialCollateralAssetAmount =
          Number(data) * Number(collateralTokenBalance?.formatted);
        setIsCustomActive(false);

        const partialCollateralAssetAmountBigN = new BigNumber(
          partialCollateralAssetAmount
        );

        return setValue(
          'collateralAmount',
          partialCollateralAssetAmountBigN.toString(),
          {
            shouldValidate: true,
          }
        );
      }
    },
  });

  const collateralAmount = watch('collateralAmount');
  // console.log('colateral', collateralAmount);
  useEffect(() => {
    if (
      !collateralAmount ||
      isNaN(collateralAmount) ||
      collateralAmount === previousCollateralAmount
    ) {
      return;
    }

    if (collateralAmount.toString().includes(',')) {
      setError('collateralAmount', {
        type: 'comma',
        message:
          'Please use a period (.) instead of a comma (,) for decimal separation.',
      });
      return;
    } else {
      clearErrors('collateralAmount');
    }

    // const calculateAndUpdateTokens = async () => {
    //   const mintableTokens = await calculateMintableTokens(collateralAmount);
    //   const mintableTokensBigN = new BigNumber(mintableTokens);
    //   const senTokenLeftToMintBigN = new BigNumber(
    //     senTokenLeftToMint?.formatted as string
    //   );

    //   if (mintableTokensBigN.isGreaterThan(senTokenLeftToMintBigN)) {
    //     setError('tokenAmount', {
    //       type: 'max',
    //       message:
    //         "The amount you're trying to mint is higher than the tokens left",
    //     });
    //   } else {
    //     clearErrors('tokenAmount');
    //   }

    //   setValue(
    //     'tokenAmount',
    //     ((collateralAmount * Number(mintableTokens) * 1e10) / 2).toString(),
    //     {
    //     shouldValidate: true
    //     }
    //   );
    // };
    setPreviousCollateralAmount(collateralAmount);
    // calculateAndUpdateTokens();
  }, [
    collateralAmount,
    calculateMintableTokens,
    setError,
    setValue,
    clearErrors,
    mintableSenTokens,
    senTokenLeftToMint,
  ]);
  console.log('deposited ', depositedCollateral);

  const formattedUserMintedAmount = useMemo(() => {
    if (accountInformation) {
      return formatUnits(accountInformation[0], senTokenBalance?.decimals);
    }

    return '';
  }, [accountInformation, senTokenBalance?.decimals]);

  console.log('account info', accountInformation);

  const {
    getRadioProps: getTokenAmountPercentageRadioProps,
    setValue: setPercentageTokenAmountValue,
  } = useRadioGroup({
    name: '0.25',
    defaultValue: '0',
    onChange: (data) => {
      if (isWithdraw) {
        const partialSenTokenAmount =
          Number(data) * Number(senTokenBalance?.formatted);
        const safePartialSenTokenAmount = isNaN(partialSenTokenAmount)
          ? 0
          : partialSenTokenAmount;

        setIsCustomActive(false);

        const partialSenTokenAmountBigN = new BigNumber(
          safePartialSenTokenAmount
        );

        return setValue('tokenAmount', partialSenTokenAmountBigN.toString(), {
          shouldValidate: true,
        });
      } else {
        const selectedPercentage = parseFloat(data);

        const senUSDInputToBorrow = calculateSenUSDInputToBorrow(
          selectedPercentage * 100,
          senUSDBorrowed,
          nominalCollateralDeposited,
          nominalCollateralInputToDeposit,
          priceOfCollateral
        );

        const safeSenUSDInputToBorrow = isNaN(senUSDInputToBorrow)
          ? 0
          : senUSDInputToBorrow;

        setValue('tokenAmount', safeSenUSDInputToBorrow.toString(), {
          shouldValidate: true,
        });
      }
    },
  });

  const tokenAmount = watch('tokenAmount');
  console.log('senTokenAmountToborrow', tokenAmount);
  useEffect(() => {
    if (
      !tokenAmount ||
      isNaN(tokenAmount) ||
      tokenAmount === previousTokenAmount
    ) {
      return;
    }

    if (tokenAmount.toString().includes(',')) {
      setError('tokenAmount', {
        type: 'comma',
        message:
          'Please use a period (.) instead of a comma (,) for decimal separation.',
      });
      return;
    } else {
      clearErrors('tokenAmount');
    }

    const calculateAndUpdateTokens = async () => {
      const mintableTokens = await calculateMintableTokens(collateralAmount);
      const mintableTokensBigN = new BigNumber(mintableTokens);
      const senTokenLeftToMintBigN = new BigNumber(
        senTokenLeftToMint?.formatted as string
      );

      if (mintableTokensBigN.isGreaterThan(senTokenLeftToMintBigN)) {
        setError('tokenAmount', {
          type: 'max',
          message:
            "The amount you're trying to mint is higher than the tokens left",
        });
      } else {
        clearErrors('tokenAmount');
      }

      setValue(
        'tokenAmount',
        ((tokenAmount * Number(mintableTokens) * 1e10) / 2).toString(),
        {
          shouldValidate: true,
        }
      );
    };
    setPreviousTokenAmount(tokenAmount);
    // calculateAndUpdateTokens();
  }, [
    tokenAmount,
    calculateMintableTokens,
    setError,
    setValue,
    clearErrors,
    mintableSenTokens,
  ]);

  const combinedBorrow =
    parseFloat(formattedUserMintedAmount) + parseFloat(tokenAmount);

  // LTV calculations
  function ltvCalculator(borrowed: number, collateralValue: number): number {
    const ltv = borrowed / collateralValue;
    return ltv * 100;
  }

  const fixedDeposit = !isWithdraw
    ? Number(depositedCollateral) / 1e18 + Number(collateralAmount)
    : Math.max(
        0,
        Number(depositedCollateral) / 1e18 - Number(collateralAmount)
      );

  const accountInfoBigInt = BigInt(accountInformation?.[1]?.toString() || '0');
  const depositedCollateralBigInt = depositedCollateral
    ? BigInt(Number(depositedCollateral))
    : BigInt(0);

  const priceOfCollateralBigInt =
    depositedCollateralBigInt !== BigInt(0)
      ? (accountInfoBigInt * BigInt(1e18)) / depositedCollateralBigInt
      : BigInt(0);

  const ethToUsd = Number(priceOfCollateralBigInt) / 1e18;

  const formattedDeposited = Number(depositedCollateral) / 1e18;
  const collateral = Number(collateralAmount) + formattedDeposited;
  const collateralValueInUsd = collateral * ethToUsd;
  console.log('Collateral Amount: ', collateralAmount);
  console.log('Deposited Collateral: ', Number(depositedCollateral));
  console.log('Collateral Value in USD: ', collateralValueInUsd);
  console.log(
    'combined',
    combinedBorrow,
    'collateralValue',
    collateralValueInUsd
  );

  const maxBorrowableInUsd = collateralValueInUsd / 2;
  const alreadyBorrowedInUsd = Number(formattedUserMintedAmount).toFixed(2);
  //@ts-ignore for building
  const remainingBorrowableInUsd = maxBorrowableInUsd - alreadyBorrowedInUsd;
  const remainingBorrowableInEth = remainingBorrowableInUsd / ethToUsd;
  const formattedRemainingBorrowableInEth = isNaN(remainingBorrowableInEth)
    ? '0.000000'
    : remainingBorrowableInEth.toFixed(6);

  const handleMaxButtonClickBorrow = () => {
    const maxBalance = setRadioValue('1');
    setValue('collateralAmount', maxBalance);
  };

  const handleMaxButtonClickWithdraw = () => {
    // const maxBalanceWithdrawn = setRadioValue('1');
    setValue('collateralAmount', remainingBorrowableInEth);
    return remainingBorrowableInEth;
  };

  const handleMaxSenUsdButton = () => {
    const maxBalanceSenUSD = setRadioValue('0.50');
    setValue('tokenAmount', maxBalanceSenUSD);
  };

  const handleMaxRepayButton = () => {
    const repayMaxBalance = setRadioValue('1');
    setValue('tokenAmount', repayMaxBalance);
  };

  console.log('withdrawable amount', remainingBorrowableInEth);

  const emptyBorrow = parseFloat(formattedUserMintedAmount) + Number(0);

  const ltvStatic = ltvCalculator(emptyBorrow, collateralValueInUsd);

  const ltvResult = ltvCalculator(combinedBorrow, collateralValueInUsd);

  const formattedLTVValue = isNaN(ltvResult)
    ? `${ltvStatic.toFixed(2)}%`
    : `${ltvResult.toFixed(2)}%`;

  const formattedEmptyLTVValue = isNaN(ltvStatic)
    ? `0%`
    : `${ltvResult.toFixed(2)}%`;

  const formattedMaxLTVThreshold = Number(liquidationThreshold) / 1e18;

  useEffect(() => {
    console.log('ltvResult:', ltvResult);
    console.log('ltvStatic:', ltvStatic);

    let newLtvColor = '';
    if (!isNaN(ltvResult)) {
      if (ltvResult < 22) {
        newLtvColor = 'blue.500';
      } else if (ltvResult >= 22 && ltvResult <= 48) {
        newLtvColor = 'yellow.500';
      } else {
        newLtvColor = 'red.500';
      }
    } else if (!isNaN(ltvStatic)) {
      if (ltvStatic < 22 || ltvStatic > 49) {
        newLtvColor = 'blue.500';
      } else if (ltvStatic >= 22 && ltvStatic <= 48) {
        newLtvColor = 'yellow.500';
      } else {
        newLtvColor = 'red.500';
      }
    } else {
      newLtvColor = '';
    }

    setLtvColor(newLtvColor);
    setPercentageValue(ltvResult);
    setLtvResult(ltvResult);
  }, [ltvResult, ltvStatic, setLtvColor, setLtvResult, setPercentageValue]);

  // TARGET LTV CALCULATIONS

  function calculateSenUSDInputToBorrow(
    ltv: number,
    senUSDBorrowed: number,
    nominalCollateralDeposited: number,
    nominalCollateralInputToDeposit: number,
    priceOfCollateral: number
  ): number {
    const ltvCapped = Math.min(ltv, 50);
    const denominator =
      (nominalCollateralDeposited + nominalCollateralInputToDeposit) *
      priceOfCollateral;

    const senUSDInputToBorrow = (ltv / 100) * denominator - senUSDBorrowed;

    return senUSDInputToBorrow;
  }

  const senUSDBorrowed = Number(formattedUserMintedAmount);
  const nominalCollateralDeposited = formattedDeposited;
  const nominalCollateralInputToDeposit = Number(collateralAmount);
  const priceOfCollateral = ethToUsd;
  const formattedDesiredLTV = Number(desiredLTV / 2);

  const senUSDInputToBorrow = calculateSenUSDInputToBorrow(
    formattedDesiredLTV,
    senUSDBorrowed,
    nominalCollateralDeposited,
    nominalCollateralInputToDeposit,
    priceOfCollateral
  );

  console.log(
    `senUSD Input To Borrow for ${desiredLTV}% LTV: ${senUSDInputToBorrow}`
  );

  const handleInputChange = (valueString: string) => {
    const newValue = parseFloat(valueString);
    const newLtvResult = isNaN(newValue) ? 0 : newValue;

    // Calculate the LTV as a percentage of the maximum LTV threshold
    const calculatedLTV = (newLtvResult / 100) * formattedMaxLTVThreshold * 100;

    setDesiredLTV(calculatedLTV);
    setPercentageValue(newLtvResult);

    let newLtvColor = '';
    if (!isNaN(newLtvResult)) {
      if (newLtvResult < 22) {
        newLtvColor = 'blue.500';
      } else if (newLtvResult >= 22 && newLtvResult <= 48) {
        newLtvColor = 'yellow.500';
      } else {
        newLtvColor = 'red.500';
      }
    } else {
      newLtvColor = 'red.500';
    }

    setLtvResult(calculatedLTV);
    setLtvColor(newLtvColor);

    // Calculate senUSDInputToBorrow based on the custom LTV (newLtvResult)
    const senUSDInputToBorrow = calculateSenUSDInputToBorrow(
      newLtvResult,
      senUSDBorrowed,
      nominalCollateralDeposited,
      nominalCollateralInputToDeposit,
      priceOfCollateral
    );

    // Set the calculated senUSDInputToBorrow value
    setValue('tokenAmount', senUSDInputToBorrow.toString(), {
      shouldValidate: true,
    });
  };

  return (
    <>
      <GridItem order={1} colSpan={2}>
        <Stack
          spacing={[6, 6, '1.504vw']}
          px={[5, 5, '1.253vw']}
          py={[6, 6, '1.504vw']}
        >
          <FormControl>
            <Box
              border="1px solid rgba(232, 185, 106, 0.12)"
              py={[1, 1, '0.251vw']}
              px={[2, 2, '0.501vw']}
              borderRadius="md"
              w="fit-content"
            >
              <Flex
                gap={[2, 2, '0.501vw']}
                overflowX="auto"
                pb={[0.5, 0.5, '0.125vw']}
                sx={{
                  '&::-webkit-scrollbar': {
                    height: [1.5, 1.5, '0.376vw'],
                    width: [1.5, 1.5, '0.376vw'],
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'dash.tooltip',
                    width: [1.5, 1.5, '0.376vw'],
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'background.tertiary',
                    borderRadius: '24px',
                  },
                }}
                w="fit-content"
              >
                {networkOptions?.map((option) => {
                  return (
                    <CustomRadio
                      key={option.value}
                      {...getNetworkRadioProps({ value: option.value })}
                    >
                      <HStack spacing={[2, 2, '0.501vw']}>
                        <Icon
                          fontSize={['sm', 'sm', 'md', 'md', '0.877vw']}
                          as={option.icon}
                        />
                        <Text fontSize={['xs', 'xs', 'md', 'md', '0.752vw']}>
                          {option.label}
                        </Text>
                      </HStack>
                    </CustomRadio>
                  );
                })}
              </Flex>
            </Box>
          </FormControl>
          <FormControl isInvalid={!!errors.collateralAmount}>
            <FormLabel
              color="text.secondary"
              fontSize={['sm', 'sm', 'sm']}
              display="flex"
              justifyContent="space-between"
            >
              <Text fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}>
                {isWithdraw ? 'Remove Collateral' : 'Collateral Assets'}
              </Text>
              <Text fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}>
                {collateralTokenBalance?.formatted}{' '}
                {collateralTokenBalance?.symbol}
              </Text>
            </FormLabel>
            <Box
              border="1px solid rgba(232, 185, 106, 0.12)"
              py={[1, 1, '0.251vw']}
              px={[2, 2, '0.501vw']}
              borderRadius="md"
              color="text.secondary"
            >
              <Flex>
                <CollateralAssetsMenu />
                <InputGroup>
                  <Input
                    pl={[4, 4, 4]}
                    placeholder="0"
                    textColor="text.secondary"
                    fontSize={['sm', 'md', 'md', 'xl']}
                    variant="unstyled"
                    {...register('collateralAmount')}
                  />
                  <InputRightElement>
                    <Flex
                      onClick={
                        !isWithdraw
                          ? handleMaxButtonClickBorrow
                          : handleMaxButtonClickWithdraw
                      }
                      paddingRight={[0, 0, 10, 10, 0]}
                      mt={[0, 0, 2, 0, 0]}
                    >
                      <CustomRadioButton
                        {...getCollateralPercentageRadioProps({
                          value: radioValue,
                        })}
                        isChecked={isChecked}
                      >
                        MAX
                      </CustomRadioButton>
                    </Flex>
                  </InputRightElement>
                </InputGroup>
              </Flex>
            </Box>

            {errors.collateralAmount && (
              <FormErrorMessage>
                {errors.collateralAmount.message as string}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.tokenAmount}>
            <FormLabel
              color="text.secondary"
              fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
            >
              {isWithdraw ? 'Repay senUSD' : 'senUSD to Borrow'}
            </FormLabel>
            <Box
              width={['100%', '100%', '100%', '100%']}
              py={[1, 1, '0.251vw']}
              px={[2, 2, '0.501vw']}
              borderRadius="md"
              color="text.secondary"
              alignContent={'center'}
            >
              <Flex>
                <InputGroup>
                  <InputLeftElement width={[28, 28, 28]}>
                    <HStack spacing={[2, 2, 2, 2]} mt={[0, 0, 4, 2, 2, 0]}>
                      <Icon
                        as={TokenLogo}
                        w={[6, 6, 8, 8]}
                        h={[6, 6, 6, 8, 8]}
                      />
                      <Text
                        fontSize={['sm', 'md', 'md', 'lg', '1.003vw']}
                        color="white"
                      >
                        senUSD
                      </Text>
                    </HStack>
                  </InputLeftElement>
                  <Input
                    pl={[32, 32, 32]}
                    py={[0, 0, 4, 0, 0]}
                    placeholder="0"
                    textColor="text.secondary"
                    fontSize={['sm', 'md', 'md', 'xl']}
                    {...register('tokenAmount')}
                    h={[10, 10, 10, 10, 12]}
                  />
                  <InputRightElement>
                    <Flex
                      onClick={
                        isWithdraw
                          ? handleMaxRepayButton
                          : handleMaxSenUsdButton
                      }
                      paddingRight={[0, 0, 10, 10, 0]}
                      mt={[0, 0, 2, 0, 0]}
                    >
                      <CustomRadioButton
                        {...getTokenAmountPercentageRadioProps({
                          value: radioValue,
                        })}
                        isChecked={isChecked}
                      >
                        MAX
                      </CustomRadioButton>
                    </Flex>
                  </InputRightElement>
                </InputGroup>
              </Flex>
            </Box>

            {errors.tokenAmount && (
              <FormErrorMessage>
                {errors.tokenAmount.message as string}
              </FormErrorMessage>
            )}
          </FormControl>
        </Stack>
        <Box
          px={[5, 8, '2.005vw']}
          py={4}
          borderTop="1px solid rgba(232, 185, 106, 0.12)"
          w="full"
        >
          <InfoStat
            tooltipLabel="Loan to Value: percentage of debt compared to the collateral. The higher it is, the risker the position"
            label="LTV:"
            // value={`${formattedLTVValue}`}
            value={
              Number(depositedCollateral) > 0 ? (
                <Text color={ltvColor}>{formattedLTVValue}</Text>
              ) : (
                <Text>{formattedEmptyLTVValue}</Text>
              )
            }
          />
        </Box>
      </GridItem>

      <GridItem
        order={2}
        colSpan={2}
        px={[5, 8, '2.005vw']}
        py={[6, 6, '1.504vw']}
        borderTop="1px solid rgba(232, 185, 106, 0.12)"
        borderRight="1px solid rgba(232, 185, 106, 0.12)"
      >
        {!isWithdraw ? (
          <Flex
            w="full"
            justifyContent="space-between"
            alignItems="center"
            borderRadius="md"
            border="1px solid rgba(232, 185, 106, 0.12)"
            py={[1, 1, '0.251vw']}
            // px={[2, 2, '0.501vw']}
            overflowX="auto"
            sx={{
              '&::-webkit-scrollbar': {
                height: ['6px', '6px', '0.417vw'],
                width: ['6px', '6px', '0.417vw'],
              },
              '&::-webkit-scrollbar-track': {
                background: 'dash.tooltip',
                width: ['6px', '6px', '0.417vw'],
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'background.tertiary',
                borderRadius: '24px',
              },
              pointerEvents: collateralAmount > 0 ? 'auto' : 'none',
              filter: collateralAmount > 0 ? 'none' : 'grayscale(100%)',
              opacity: collateralAmount > 0 ? 1 : 0.6,
            }}
            // gap={[2, 2, '0.501vw']}
          >
            <CustomRadio
              {...getTokenAmountPercentageRadioProps({ value: '0.125' })}
            >
              25%
            </CustomRadio>
            <CustomRadio
              {...getTokenAmountPercentageRadioProps({ value: '0.25' })}
            >
              50%
            </CustomRadio>
            <CustomRadio
              {...getTokenAmountPercentageRadioProps({ value: '0.375' })}
            >
              70%
            </CustomRadio>
            <CustomRadio
              {...getTokenAmountPercentageRadioProps({ value: '0.50' })}
            >
              100%
            </CustomRadio>
            {/* <Button onClick={() => calculateAndUpdateTokens(collateralAmount)}>25%</Button> */}
            {/* <Button
            onClick={onOpen}
            w="full"
            bg={isCustomActive ? 'background.tertiary' : 'transparent'}
            _hover={{
              bg: 'none',
            }}
            color="text.secondary"
            fontSize={['xs', 'xs', '0.833vw']}
          >
            Custom
          </Button> */}

            <InputGroup>
              <NumberInput
                precision={2}
                step={1}
                max={100}
                min={0}
                color="text.secondary"
                value={
                  isNaN(percentageValue) ? '0' : percentageValue.toFixed(0)
                }
                onChange={(valueString) => {
                  return handleInputChange(valueString);
                }}
              >
                <NumberInputField
                  _hover={{
                    borderColor: `${hexToRgba(brandSecondary, 0.5)}`,
                  }}
                  _focusVisible={{
                    borderColor: `${hexToRgba(brandSecondary, 0.5)}`,
                    boxShadow: 'none !important',
                  }}
                  borderColor={`${hexToRgba(brandSecondary, 0.12)}`}
                  placeholder="XX %"
                  fontSize="sm"
                  paddingX={2}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper color={'brand.secondary'} />
                  <NumberDecrementStepper color={'brand.secondary'} />
                </NumberInputStepper>
              </NumberInput>
            </InputGroup>

            <CustomTokenValueModal
              onClose={onClose}
              isOpen={isOpen}
              onSave={() => {
                setPercentageWalletValue('0');
                setIsCustomActive(true);
              }}
            />
          </Flex>
        ) : (
          <Flex></Flex>
        )}
        {/* <Stack direction='row' justifyContent='flex-end' mt={[4, 4, 4, 16, '2.010vw']}>
          <Flex alignItems='center'>
            <Text marginRight='4' color="text.secondary">Borrow</Text>
            <Switch colorScheme="brand.secondary"  size="lg" onChange={toggle} />
          </Flex>
          
          <Text color="text.secondary">Withdraw</Text>
        </Stack> */}

        <Stack spacing={[2.5, 2.5, '0.627vw']} mt={[4, 4, 4, 16, '4.010vw']}>
          <Text
            fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
            color="text.secondary"
          >
            Your Wallet Balances
          </Text>
          <WalletBalanceInfo
            token={TokenLogo}
            tokenName="senUSD"
            value={`${
              senTokenBalance?.formatted ? senTokenBalance.formatted : '0'
            }`}
          />
          {activeCollateralToken && collateralTokenBalance && (
            <WalletBalanceInfo
              token={activeCollateralToken.symbol}
              tokenName={activeCollateralToken.symbol}
              value={collateralTokenBalance?.formatted?.toLocaleString()}
            />
          )}
        </Stack>
      </GridItem>
    </>
  );
};

export default BorrowForm;
