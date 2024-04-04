import {
  Button,
  FormControl,
  HStack,
  Icon,
  Input,
  InputGroup,
  Stack,
  Text,
  FormErrorMessage,
  InputRightElement,
  Center,
  Circle,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAccount } from 'wagmi';
import { BsArrowDownShort } from 'react-icons/bs';

import TokenLogo from 'assets/logos/token-logo.svg';

type UnStakeFormInputs = {
  tokenOneAmount: number;
  tokenTwoAmount: number;
};

const UnStakeForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UnStakeFormInputs>({
    mode: 'onChange',
  });
  const { address: accountAddress } = useAccount();

  const onSubmit: SubmitHandler<UnStakeFormInputs> = async (data) => {
    console.log(data);
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
      <FormControl isInvalid={!!errors.tokenOneAmount}>
        <InputGroup>
          <Input
            pl={8}
            placeholder="0"
            defaultValue={0}
            type="number"
            step="1000"
            {...register('tokenOneAmount', {
              required: 'This is required',
            })}
            color="text.secondary"
          />
          <InputRightElement width={['7rem', '7rem', '7.778vw']}>
            <HStack spacing={2}>
              <Icon
                as={TokenLogo}
                w={[5, 5, '1.253vw']}
                h={[5, 5, '1.253vw']}
              />
              <Text fontSize={['md', 'md', '1.111vw']} color="text.secondary">
                Seneca
              </Text>
            </HStack>
          </InputRightElement>
        </InputGroup>
        {errors.tokenOneAmount && (
          <FormErrorMessage fontSize={['md', 'md', '1.111vw']}>
            {errors.tokenOneAmount.message as string}
          </FormErrorMessage>
        )}
      </FormControl>
      <Center>
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
      </Center>
      <FormControl isInvalid={!!errors.tokenTwoAmount}>
        <InputGroup>
          <Input
            pl={8}
            placeholder="0"
            defaultValue={0}
            type="number"
            step="1000"
            {...register('tokenTwoAmount', {
              required: 'This is required',
            })}
            color="text.secondary"
          />
          <InputRightElement width={['7rem', '7rem', '7.778vw']}>
            <HStack spacing={2}>
              <Icon
                as={TokenLogo}
                w={[5, 5, '1.253vw']}
                h={[5, 5, '1.253vw']}
              />
              <Text fontSize={['md', 'md', '1.111vw']} color="text.secondary">
                Seneca
              </Text>
            </HStack>
          </InputRightElement>
        </InputGroup>
        {errors.tokenTwoAmount && (
          <FormErrorMessage fontSize={['md', 'md', '1.111vw']}>
            {errors.tokenTwoAmount.message as string}
          </FormErrorMessage>
        )}
      </FormControl>
      <Stack mt={4} direction={['column', 'column', 'row']} spacing={4}>
        <Button
          variant="brandYellowFill"
          w="full"
          type="button"
          loadingText="Approving"
          py={[1, 1, 1, '1.111vw']}
          fontSize={['md', 'md', '1.111vw']}
          isDisabled={!accountAddress}
        >
          UNSTAKE
        </Button>
      </Stack>
    </Stack>
  );
};

export default UnStakeForm;
