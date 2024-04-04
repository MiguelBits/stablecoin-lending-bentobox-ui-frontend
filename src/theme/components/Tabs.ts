import { tabsAnatomy as parts } from '@chakra-ui/anatomy';

const Tabs = {
  parts: parts.keys,
  baseStyle: {
    transition: '0.3s ease all',
    tab: {
      '&:focus': {
        boxShadow: 'none',
      },
    },
  },
  sizes: {},
  variants: {
    simple: {
      tablist: {
        borderRadius: 'md',
        border: '1px solid rgba(232, 185, 106, 0.12)',
        display: 'inline-flex',
        p: 1.5,
      },
      tab: {
        borderRadius: 'sm',
        fontSize: ['xs', 'xs', '0.752vw'],
        padding: '3px 5px',
        pr: '4',
        pl: '4',
        _selected: {
          backgroundColor: 'rgba(232, 185, 106, 0.12)',
        },
      },
    },
  },

  defaultProps: {
    variant: 'simple',
  },
};

export default Tabs;
