import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  Stack,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';

type SlippageFormInputs = {
  tolerance: number;
};

const SlippageForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SlippageFormInputs>();

  const onSubmit: SubmitHandler<SlippageFormInputs> = (data) => {
    return console.log(data);
  };

  return (
    <Box>
      <Stack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        align="center"
        spacing={[5, 5, '1.253vw']}
      >
        <FormControl isInvalid={!!errors.tolerance}>
          <FormLabel color="text.secondary" fontSize={['sm', 'sm', '0.877vw']}>
            Slippage Tolerance
          </FormLabel>
          <InputGroup>
            <Input
              color="white"
              placeholder="Auto 1%"
              type="number"
              {...register('tolerance', {
                required: 'This is required',
              })}
            />
          </InputGroup>
          {errors.tolerance && (
            <FormErrorMessage>
              {errors.tolerance.message as string}
            </FormErrorMessage>
          )}
        </FormControl>
        <Button variant="brandYellowFill" w="full" type="submit">
          Save
        </Button>
      </Stack>
    </Box>
  );
};

export default SlippageForm;
