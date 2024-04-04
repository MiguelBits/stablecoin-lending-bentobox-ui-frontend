import {
  FormControl,
  Input,
  InputGroup,
  Stack,
  FormErrorMessage,
  FormLabel,
  Grid,
  Center,
  Circle,
  Icon,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BsArrowDownShort } from 'react-icons/bs';

type CalcFormInputs = {
  userLiquidity: number;
  totalLiquidity: number;
  poolv2Token: number;
  totalveLit: number;
  userBoost: number;
  userRewardvApr: number;
  minveLit: number;
};

const CalcForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CalcFormInputs>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<CalcFormInputs> = async (data) => {
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
      <Grid
        gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}
        gap={[2.5, 2.5, '0.627vw']}
      >
        <FormControl isInvalid={!!errors.userLiquidity}>
          <FormLabel color="text.secondary" fontSize={['sm', 'sm', '0.972vw']}>
            User Liquidity
          </FormLabel>
          <InputGroup>
            <Input
              pl={8}
              placeholder="0"
              defaultValue={0}
              type="number"
              step="1000"
              {...register('userLiquidity', {
                required: 'This is required',
              })}
              color="text.secondary"
            />
          </InputGroup>
          {errors.userLiquidity && (
            <FormErrorMessage fontSize={['md', 'md', '1.111vw']}>
              {errors.userLiquidity.message as string}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.totalLiquidity}>
          <FormLabel color="text.secondary" fontSize={['sm', 'sm', '0.972vw']}>
            Total Liquidity
          </FormLabel>
          <InputGroup>
            <Input
              pl={8}
              placeholder="0"
              defaultValue={0}
              type="number"
              step="1000"
              {...register('totalLiquidity', {
                required: 'This is required',
              })}
              color="text.secondary"
            />
          </InputGroup>
          {errors.totalLiquidity && (
            <FormErrorMessage fontSize={['md', 'md', '1.111vw']}>
              {errors.totalLiquidity.message as string}
            </FormErrorMessage>
          )}
        </FormControl>
      </Grid>
      <Grid
        gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}
        gap={[2.5, 2.5, '0.627vw']}
      >
        <FormControl isInvalid={!!errors.poolv2Token}>
          <FormLabel color="text.secondary" fontSize={['sm', 'sm', '0.972vw']}>
            Deposit 3PoolV2 tokens
          </FormLabel>
          <InputGroup>
            <Input
              pl={8}
              placeholder="0"
              defaultValue={0}
              type="number"
              step="1000"
              {...register('poolv2Token', {
                required: 'This is required',
              })}
              color="text.secondary"
            />
          </InputGroup>
          {errors.poolv2Token && (
            <FormErrorMessage fontSize={['md', 'md', '1.111vw']}>
              {errors.poolv2Token.message as string}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.totalveLit}>
          <FormLabel color="text.secondary" fontSize={['sm', 'sm', '0.972vw']}>
            Total veLIT
          </FormLabel>
          <InputGroup>
            <Input
              pl={8}
              placeholder="0"
              defaultValue={0}
              type="number"
              step="1000"
              {...register('totalveLit', {
                required: 'This is required',
              })}
              color="text.secondary"
            />
          </InputGroup>
          {errors.totalveLit && (
            <FormErrorMessage fontSize={['md', 'md', '1.111vw']}>
              {errors.totalveLit.message as string}
            </FormErrorMessage>
          )}
        </FormControl>
      </Grid>
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
      <Grid
        gridTemplateColumns={['1fr', '1fr', '1fr 1fr 1fr']}
        gap={[2.5, 2.5, '0.627vw']}
      >
        <FormControl isInvalid={!!errors.userBoost}>
          <FormLabel color="text.secondary" fontSize={['sm', 'sm', '0.972vw']}>
            User Boost
          </FormLabel>
          <InputGroup>
            <Input
              pl={8}
              placeholder="0"
              defaultValue={0}
              type="number"
              step="1000"
              {...register('userBoost', {
                required: 'This is required',
              })}
              color="text.secondary"
            />
          </InputGroup>
          {errors.userBoost && (
            <FormErrorMessage fontSize={['md', 'md', '1.111vw']}>
              {errors.userBoost.message as string}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.userRewardvApr}>
          <FormLabel color="text.secondary" fontSize={['sm', 'sm', '0.972vw']}>
            User Reward vAPR
          </FormLabel>
          <InputGroup>
            <Input
              pl={8}
              placeholder="0"
              defaultValue={0}
              type="number"
              step="1000"
              {...register('userRewardvApr', {
                required: 'This is required',
              })}
              color="text.secondary"
            />
          </InputGroup>
          {errors.userRewardvApr && (
            <FormErrorMessage fontSize={['md', 'md', '1.111vw']}>
              {errors.userRewardvApr.message as string}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.minveLit}>
          <FormLabel color="text.secondary" fontSize={['sm', 'sm', '0.972vw']}>
            Minimum veLIT for Max Boost
          </FormLabel>
          <InputGroup>
            <Input
              pl={8}
              placeholder="0"
              defaultValue={0}
              type="number"
              step="1000"
              {...register('minveLit', {
                required: 'This is required',
              })}
              color="text.secondary"
            />
          </InputGroup>
          {errors.minveLit && (
            <FormErrorMessage fontSize={['md', 'md', '1.111vw']}>
              {errors.minveLit.message as string}
            </FormErrorMessage>
          )}
        </FormControl>
      </Grid>
    </Stack>
  );
};

export default CalcForm;
