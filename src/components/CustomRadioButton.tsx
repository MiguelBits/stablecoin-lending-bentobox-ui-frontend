import { Box, Flex, useRadio } from '@chakra-ui/react';

interface CustomRadioProps {
  children: React.ReactNode;
  isChecked: boolean;
}
const CustomRadioButton: React.FC<CustomRadioProps> = ({
  children,
  ...props
}) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" w="full" cursor="pointer">
      <input {...input} />
      <Flex
        {...checkbox}
        _checked={{ bg: 'background.tertiary' }}
        textAlign="center"
        alignItems="center"
        borderRadius={['md', 'md', '0.417vw']}
        color="brand.secondary"
        fontSize={['xs', 'xs', 'sm']}
        justifyContent="center"
        p={[2, 2, '0.556vw']}
        w="full"
        _hover={{ backgroundColor: 'rgba(232, 185, 106, 0.2)' }}
      >
        {children}
      </Flex>
    </Box>
  );
};

export default CustomRadioButton;
