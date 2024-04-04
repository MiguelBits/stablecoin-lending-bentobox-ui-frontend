import { switchAnatomy as parts } from '@chakra-ui/anatomy';

const Switch = {
  parts: parts.keys,
  baseStyle: {},
  sizes: {},
  colorScheme: {
    brandYellowFill: {
      thumb: {
        bg: 'yellow', // Set the background color of the thumb to yellow
        borderColor: 'yellow.300', // Set the border color of the thumb to yellow
      },
    },
  },
  defaultProps: {},
};

export default Switch;
