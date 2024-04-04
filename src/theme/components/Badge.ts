const Badge = {
  baseStyle: {
    transition: 'all 0.3s ease',
    border: '1px solid',
    fontSize: ['xs', 'xs', '0.752vw'],
  },
  sizes: {},
  variants: {
    default: {
      borderColor: 'brand.secondary',
      bg: 'background.tertiary',
      color: 'brand.secondary',
      _hover: {
        bg: 'background.secondary',
      },
    },
  },
  defaultProps: {
    variant: 'default',
  },
};

export default Badge;
