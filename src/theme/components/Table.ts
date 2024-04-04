import { tableAnatomy as parts } from '@chakra-ui/anatomy';

const Table = {
  parts: parts.keys,
  baseStyle: {},
  sizes: {},
  variants: {
    simple: {
      table: {
        borderSpacing: ['0 6px', '0 6px', '0 0.376vw'],
        borderCollapse: 'separate',
      },
      th: {
        fontSize: ['0.813rem', '0.813rem', '0.815vw'],
        color: 'text.secondary',
        fontFamily: 'body',
        fontWeight: '400',
        textTransform: 'capitalize',
        border: 'none',
      },
      tbody: {
        color: 'text.secondary',
        fontSize: ['sm', 'sm', '0.877vw'],
        tr: {
          mb: [1.5, 1.5, '0.376vw'],
          td: {
            transition: 'all 0.3s ease',
            bg: 'background.primary',
            borderTop: '1px solid rgba(232, 185, 106, 0.12)',
            borderBottom: '1px solid rgba(232, 185, 106, 0.12)',
            '&:first-child': {
              borderLeft: '1px solid rgba(232, 185, 106, 0.12)',
              borderLeftRadius: '0.375rem !important',
            },
            '&:last-child': {
              borderRight: '1px solid rgba(232, 185, 106, 0.12)',
              borderRightRadius: '0.375rem !important',
            },
          },
          _hover: {
            td: {
              bg: 'rgba(232, 185, 106, 0.02)',
            },
          },
        },
      },
    },
  },
  defaultProps: {
    variants: 'simple',
  },
};

export default Table;
