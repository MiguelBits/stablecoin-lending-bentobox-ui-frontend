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
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAccount } from 'wagmi';

import TokenLogo from 'assets/logos/token-logo.svg';

type ZapFormInputs = {
  senecaAmount: number;
};

const ZapForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ZapFormInputs>({
    mode: 'onChange',
  });
  const { address: accountAddress } = useAccount();

  const onSubmit: SubmitHandler<ZapFormInputs> = async (data) => {
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
      <FormControl isInvalid={!!errors.senecaAmount}>
        <InputGroup>
          <Input
            pl={8}
            placeholder="0"
            defaultValue={0}
            type="number"
            step="1000"
            {...register('senecaAmount', {
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
        {errors.senecaAmount && (
          <FormErrorMessage fontSize={['md', 'md', '1.111vw']}>
            {errors.senecaAmount.message as string}
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
          ZAP
        </Button>
      </Stack>
    </Stack>
  );
};

export default ZapForm;
