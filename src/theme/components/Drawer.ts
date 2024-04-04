import { drawerAnatomy as parts } from '@chakra-ui/anatomy';

const Drawer = {
  parts: parts.keys,
  baseStyle: {
    dialog: {
      backgroundColor: 'background.primary',
      border: '1px solid',
      borderColor: 'rgba(232,185,106,0.12)',
      boxShadow: '0px 0px 10px 0px rgba(232, 185, 106, 0.15)',
      py: 1,
      bgGradient:
        'linear(to-t, background.primary 40%,  background.secondary 90%)',
    },
    closeButton: {
      _focus: { boxShadow: 'none' },
      _hover: { color: 'accent.two' },
    },
  },
  sizes: {},
  variants: {},
  defaultProps: {},
};

export default Drawer;
