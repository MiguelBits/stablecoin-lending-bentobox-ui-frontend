import {
  Button,
  Center,
  Circle,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  Stack,
  Text,
  Tooltip,
  FormErrorMessage,
} from '@chakra-ui/react';
import { BsArrowDownShort } from 'react-icons/bs';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAccount } from 'wagmi';
import { useCallback } from 'react';
// import { InputMask } from '@react-input/mask';

import { useSaleContext } from 'contexts/saleContext';

import TokenLogo from 'assets/logos/token-logo.svg';

import USDTLogo from '../../../../node_modules/cryptocurrency-icons/svg/color/usdt.svg';

type PresaleFormInputs = {
  usdtAmount: number;
  senecaAmount: number;
};

const PresaleForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<PresaleFormInputs>({
    mode: 'onChange',
  });
  const { address: accountAddress } = useAccount();

  const {
    minPurchase,
    maxPurchase,
    usdtBalance,
    ratePer1e18,
    allowance,
    approveSale,
    isLoading: saleIsLoading,
    investSale,
    remainingTokens,
  } = useSaleContext();

  // const isBeforeStartDate =
  //   env.NEXT_PUBLIC_ENABLE_TESTNETS === true
  //     ? false
  //     : dayjs().isBefore(dayjs(saleStartDate));

  const onMaxUsdt = () => {
    setValue('usdtAmount', usdtBalance, {
      shouldValidate: true,
    });
    const senecaAmount = usdtBalance / Number(ratePer1e18);
    setValue('senecaAmount', senecaAmount, {
      shouldValidate: true,
    });
  };
  const onMaxSeneca = () => {
    setValue('senecaAmount', maxPurchase, {
      shouldValidate: true,
    });
    const usdtAmount = maxPurchase * Number(ratePer1e18);
    setValue('usdtAmount', usdtAmount, {
      shouldValidate: true,
    });
  };

  const isApproved = useCallback(
    (usdtAmount: number) => {
      if (accountAddress && allowance >= usdtAmount) {
        return true;
      }
      return false;
    },
    [accountAddress, allowance]
  );

  const onSubmit: SubmitHandler<PresaleFormInputs> = async (data) => {
    await investSale(data.senecaAmount);
    reset();
  };

  return (
    <Stack
      spacing={[6, 6, '1.667vw']}
      mb={[6, 6, '1.667vw']}
      as="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormControl isInvalid={!!errors.usdtAmount}>
        <FormLabel
          color="text.secondary"
          fontSize={['sm', 'sm', '0.972vw']}
          display="flex"
          justifyContent="space-between"
        >
          <Text>USDT</Text>
          <Text>Balance: {usdtBalance.toLocaleString()}</Text>
        </FormLabel>

        <InputGroup>
          <InputLeftElement width={['7rem', '7rem', '7.778vw']}>
            <HStack spacing={[2, 2, '0.556vw']}>
              <Icon as={USDTLogo} w={[6, 6, '1.667vw']} h={[6, 6, '1.667vw']} />
              <Text fontSize={['md', 'md', '1.111vw']}>USDT</Text>
            </HStack>
          </InputLeftElement>
          <Input
            pl={['8rem', '8rem', '8.889vw']}
            placeholder="0"
            defaultValue={0}
            type="number"
            step="1000"
            {...register('usdtAmount', {
              required: 'This is required',
              min: {
                value: Math.round(minPurchase * ratePer1e18),
                message: `Minimum Buy Amount is $${Math.round(
                  minPurchase * ratePer1e18
                ).toLocaleString()}`,
              },
              max: {
                value: Math.round(maxPurchase * ratePer1e18),
                message: `Maximum Buy Amount is $${(
                  Math.ceil((maxPurchase * ratePer1e18) / 10000) * 10000
                ).toLocaleString()}`,
              },
              onChange: (evt) => {
                const value = evt.target.value;
                const senecaAmount = Number(value) / Number(ratePer1e18);
                setValue('senecaAmount', senecaAmount, {
                  shouldValidate: true,
                });
              },
            })}
          />
          <InputRightAddon
            onClick={() => {
              onMaxUsdt();
            }}
            bg="background.tertiary"
            color="text.secondary"
            fontSize={['0.7rem', '0.7rem', '0.778vw']}
            cursor="pointer"
            _hover={{
              bg: 'background.secondary',
            }}
            h={[10, 10, '2.506vw']}
          >
            Max
          </InputRightAddon>
        </InputGroup>
        {errors.usdtAmount && (
          <FormErrorMessage fontSize={['md', 'md', '1.111vw']}>
            {errors.usdtAmount.message as string}
          </FormErrorMessage>
        )}
      </FormControl>
      <Center mb={-5}>
        <Tooltip label="Swap your USDT to SENECA">
          <Circle
            border="1px solid"
            borderColor="background.tertiary"
            size={[8, 8, '2.222vw']}
          >
            <Icon
              as={BsArrowDownShort}
              color="text.secondary"
              fontSize={['2xl', '2xl', '1.667vw']}
            />
          </Circle>
        </Tooltip>
      </Center>
      <FormControl isInvalid={!!errors.senecaAmount}>
        <FormLabel color="text.secondary" fontSize={['sm', 'sm', '0.972vw']}>
          Seneca
        </FormLabel>
        <InputGroup>
          <InputLeftElement width={['7rem', '7rem', '7.778vw']}>
            <HStack spacing={2}>
              <Icon
                as={TokenLogo}
                w={[6, 6, '1.667vw']}
                h={[6, 6, '1.667vw']}
              />
              <Text fontSize={['md', 'md', '1.111vw']}>Seneca</Text>
            </HStack>
          </InputLeftElement>
          <Input
            pl={['8rem', '8rem', '8.889vw']}
            placeholder="0"
            defaultValue={0}
            type="number"
            step="1000"
            {...register('senecaAmount', {
              required: 'This is required',
              onChange: (evt) => {
                const value = evt.target.value;
                const usdtAmount = Number(value) * Number(ratePer1e18);
                setValue('usdtAmount', usdtAmount, {
                  shouldValidate: true,
                });
              },
            })}
          />
          <InputRightAddon
            onClick={() => {
              onMaxSeneca();
            }}
            bg="background.tertiary"
            color="text.secondary"
            fontSize={['0.7rem', '0.7rem', '0.778vw']}
            cursor="pointer"
            _hover={{
              bg: 'background.secondary',
            }}
            h={[10, 10, '2.506vw']}
          >
            Max
          </InputRightAddon>
        </InputGroup>
        {errors.senecaAmount && (
          <FormErrorMessage fontSize={['md', 'md', '1.111vw']}>
            {errors.senecaAmount.message as string}
          </FormErrorMessage>
        )}
      </FormControl>
      <Stack mt={4} direction={['column', 'column', 'row']} spacing={4}>
        <Tooltip
          label={`There is no remaining tokens left for this sale.`}
          isDisabled={!(remainingTokens === 0)}
        >
          {isApproved(Number(watch('usdtAmount'))) ? (
            <Button
              variant="brandYellowFill"
              w="full"
              type="submit"
              loadingText="Processing Payment"
              py={[1, 1, 1, '1.111vw']}
              fontSize={['md', 'md', '1.111vw']}
              isLoading={saleIsLoading}
              isDisabled={
                !accountAddress ||
                (accountAddress &&
                  allowance > 0 &&
                  allowance < watch('usdtAmount')) ||
                !isValid
              }
            >
              BUY WITH USDT
            </Button>
          ) : (
            <Button
              variant="brandYellowFill"
              w="full"
              type="button"
              loadingText="Approving"
              py={[1, 1, 1, '1.111vw']}
              fontSize={['md', 'md', '1.111vw']}
              onClick={approveSale}
              isLoading={saleIsLoading}
              isDisabled={!accountAddress}
            >
              APPROVE
            </Button>
          )}
        </Tooltip>
        <Button
          variant="whiteAlphaOutline"
          w={['full', 'full', 'fit-content']}
          px={[12, 12, '3.333vw']}
          py={[1, 1, 1, '1.111vw']}
          fontSize={['md', 'md', '1.111vw']}
        >
          NOTHING TO DO
        </Button>
      </Stack>
    </Stack>
  );
};

export default PresaleForm;
