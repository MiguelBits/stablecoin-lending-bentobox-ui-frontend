import { modalAnatomy as parts } from '@chakra-ui/anatomy';

const Modal = {
  parts: parts.keys,
  baseStyle: {
    dialog: {
      backgroundColor: 'background.primary',
      border: '1px solid',
      borderColor: 'rgba(232,185,106,0.12)',
      boxShadow: '0px 0px 10px 0px rgba(232, 185, 106, 0.15)',
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

export default Modal;
