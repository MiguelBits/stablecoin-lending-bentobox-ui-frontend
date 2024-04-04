const Link = {
  baseStyle: {
    textDecoration: 'none',
    _hover: {
      textDecoration: 'none',
    },
  },
  sizes: {},
  variants: {
    borderBottomAnimation: {
      _after: {
        content: `''`,
        display: 'block',
        width: 0,
        height: '2px',
        background: 'white',
        transition: 'width 0.3s',
      },
      _hover: {
        _after: {
          width: '100%',
        },
      },
    },
  },
  defaultProps: {},
};

export default Link;
