import { alertAnatomy as parts } from '@chakra-ui/anatomy';

const Alert = {
  parts: parts.keys,
  baseStyle: {
    container: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      w: ['full', '350px'],
      p: [4, 4, '1.003vw'],
      boxShadow: 'md',
      borderRadius: 'md',
    },
    description: {
      fontSize: ['sm', 'sm', '0.877vw'],
    },
  },
  sizes: {},
  variants: {
    success: {
      container: {
        bgColor: 'system.success',
        color: 'background.primary',
      },
    },
    error: {
      container: {
        bgColor: 'brand.accent.two',
        color: 'background.primary',
      },
    },
    warning: {
      container: {
        bgColor: 'brand.secondary',
        color: 'background.primary',
      },
    },
    info: {
      container: {
        bgColor: 'brand.primary',
        color: 'background.primary',
      },
    },
  },
  defaultProps: {
    defaultVariant: 'info',
  },
};

export default Alert;
