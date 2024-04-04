import { progressAnatomy as parts } from '@chakra-ui/anatomy';

const Progress = {
  parts: parts.keys,
  baseStyle: {},
  sizes: {},
  variants: {
    brandYellowFill: {
      track: {
        borderRadius: ['5px', '5px', '0.313vw'],
      },
      filledTrack: {
        borderRadius: ['5px', '5px', '0.313vw'],
        bg: 'brand.secondary',
      },
    },
  },
  defaultProps: {
    variant: 'brandYellowFill',
  },
};

export default Progress;
