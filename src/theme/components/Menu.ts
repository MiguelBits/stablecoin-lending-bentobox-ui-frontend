import { menuAnatomy as parts } from '@chakra-ui/anatomy';

const Menu = {
  parts: parts.keys,
  baseStyle: {},
  variants: {
    simpleMenu: {
      list: {
        bg: 'background.primary',
        border: '1px solid',
        borderColor: 'background.tertiary',
        p: [2, 2, '0.501vw'],
        borderRadius: 'md',
        boxShadow: '0px 0px 10px 0px rgba(232, 185, 106, 0.15)',
      },
      item: {
        fontWeight: '500',
        borderRadius: 'md',
        fontSize: ['md', 'md', '1.003vw'],
        color: 'text.secondary',
        py: [2, 2, '0.501vw'],
        pl: 0,
        _hover: {
          bg: 'background.tertiary',
        },
        bg: 'transparent',
      },
    },
  },
  defaultProps: {
    variant: 'simpleMenu',
  },
};

export default Menu;
