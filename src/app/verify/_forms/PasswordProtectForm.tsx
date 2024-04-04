import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Tooltip,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

type PasswordProtectFormInputs = {
  password: number;
};

const PasswordProtectForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PasswordProtectFormInputs>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const onTogglePasswordVisibility = () => {
    return setShowPassword(!showPassword);
  };
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<PasswordProtectFormInputs> = async (data) => {
    try {
      setIsLoading(true);
      const result = await fetch(`/api/password-protect`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: data.password }),
      });
      if (result.ok) {
        router.push('/');
      } else {
        const resData = await result.json();
        setError('password', {
          type: 'custom',
          message:
            resData.message ||
            'Something went wrong. Please clear your cookies.',
        });
        console.error('[PASSWORD ERROR]', resData.message);
      }
    } catch (err) {
      console.error('[PASSWORD ERROR]', err);
      setError('password', {
        type: 'custom',
        message: 'Something Went Wrong. Please clear your cookies.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Stack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        align="center"
        spacing={[5, 5, '1.253vw']}
      >
        <FormControl isInvalid={!!errors.password}>
          <FormLabel color="text.secondary" fontSize={['sm', 'sm', '0.877vw']}>
            Password
          </FormLabel>
          <InputGroup>
            <Input
              placeholder="Enter password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'This is required.',
              })}
            />
            <InputRightElement
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Tooltip label={showPassword ? 'Hide Password' : 'Show Password'}>
                <IconButton
                  mt={[1, 1, '0.251vw']}
                  variant="unstyled"
                  aria-label="Toggle Show Password"
                  onClick={onTogglePasswordVisibility}
                  icon={
                    <Icon
                      as={showPassword ? AiFillEyeInvisible : AiFillEye}
                      fontSize={['md', 'md', '1.003vw']}
                    />
                  }
                />
              </Tooltip>
            </InputRightElement>
          </InputGroup>
          {errors.password && (
            <FormErrorMessage>
              {errors.password.message as string}
            </FormErrorMessage>
          )}
        </FormControl>
        <Button
          variant="brandYellowFill"
          w="full"
          type="submit"
          isLoading={isLoading}
          loadingText="Entering"
        >
          Enter
        </Button>
      </Stack>
    </Box>
  );
};

export default PasswordProtectForm;
