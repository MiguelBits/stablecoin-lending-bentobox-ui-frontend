const Button = {
  baseStyle: {},
  sizes: {
    sm: {
      fontSize: ['12px', '14px', '16px'],
      padding: '8px 16px',
    },
    md: {
      fontSize: ['14px', '16px', '16px'],
      padding: '10px 20px',
    },
    lg: {
      fontSize: ['16px', '18px', '20px'],
      padding: '12px 24px',
    },
  },
  variants: {
    brandYellowOutline: {
      color: 'brand.secondary',
      border: '1px solid',
      borderColor: 'brand.secondary',
      _hover: {
        bgColor: 'brand.secondary',
        color: 'brand.primary',
      },
    },
    brandYellowFill: {
      color: 'black',
      textTransform: 'uppercase',
      fontStyle: 'italic',
      border: '1px solid',
      borderColor: 'brand.secondary',
      bgColor: 'brand.secondary',
      _hover: {
        bgColor: 'brand.yellow.200',
        color: 'brand.primary',
        _disabled: {
          bgColor: 'brand.yellow.200',
          color: 'brand.primary',
        },
      },
      _active: {
        bgColor: 'brand.yellow.200',
        color: 'brand.primary',
        _disabled: {
          bgColor: 'brand.yellow.200',
          color: 'brand.primary',
        },
      },
      _focus: {
        bgColor: 'brand.yellow.200',
        color: 'brand.primary',
        _disabled: {
          bgColor: 'brand.yellow.200',
          color: 'brand.primary',
        },
      },
    },
    whiteAlphaOutline: {
      color: 'white',
      textTransform: 'uppercase',
      fontStyle: 'italic',
      border: '1px solid',
      borderColor: 'whiteAlpha.300',
      bgColor: 'transparent',
      _hover: {
        bgColor: 'whiteAlpha.300',
        color: 'white',
      },
      _active: {
        bgColor: 'whiteAlpha.300',
        color: 'white',
      },
      _focus: {
        bgColor: 'whiteAlpha.300',
        color: 'white',
      },
    },
  },
  defaultProps: {},
};

export default Button;
