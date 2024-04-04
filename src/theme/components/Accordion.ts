import { accordionAnatomy as parts } from '@chakra-ui/anatomy';

const Accordion = {
  parts: parts.keys,
  baseStyle: {},
  sizes: {},
  variants: {
    simple: {
      container: {
        border: 'none',
        borderRadius: '2xl',
        h: 'fit-content',
      },
      button: {
        h: 'fit-content',
        m: 0,
        borderTopRadius: '2xl',
        p: 0,
        mb: 0.5,
        _hover: {
          bg: 'rgba(232, 185, 106, 0.02)',
        },
        transition: 'all 0.3s ease',
        fontSize: ['lg', 'xl'],
      },
      panel: {
        borderBottomRadius: 'md',
        borderBottom: '1px solid rgba(232, 185, 106, 0.12)',
        borderLeft: '1px solid rgba(232, 185, 106, 0.12)',
        borderRight: '1px solid rgba(232, 185, 106, 0.12)',
        bg: 'background.primary',
      },
      icon: {},
    },
  },
  defaultProps: {
    variant: 'simple',
  },
};

export default Accordion;
