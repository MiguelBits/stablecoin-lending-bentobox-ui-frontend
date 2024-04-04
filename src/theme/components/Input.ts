import { inputAnatomy as parts } from '@chakra-ui/anatomy';
import { transparentize } from '@chakra-ui/theme-tools';

const Input = {
  parts: parts.keys,
  baseStyle: {},
  variants: {
    primary: {
      field: {
        border: '1px solid',
        backgroundColor: 'transparent',
        borderColor: transparentize('brand.secondary', 0.12),
        py: [2.5, 2.5, '0.627vw'],
        px: ['0.813rem', '0.813rem', '0.815vw'],
        h: [10, 10, '2.506vw'],
        fontWeight: '500',
        fontSize: ['md', 'md', '1.003vw'],
        _hover: {
          borderColor: transparentize('brand.secondary', 0.5),
        },
        _placeholder: {
          color: 'white.100',
        },
        _invalid: {
          borderColor: 'brand.accent.two',
          backgroundColor: transparentize('brand.accent.two', 0.07),
        },
        _disabled: {
          borderColor: transparentize('brand.gray', 0.07),
        },
      },
    },
  },
  defaultProps: {
    variant: 'primary',
  },
};

export default Input;
