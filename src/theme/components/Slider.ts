import { sliderAnatomy as parts } from '@chakra-ui/anatomy';

const Slider = {
  parts: parts.keys,
  baseStyle: {},
  sizes: {},
  variants: {
    yellowSlider: {
      track: {
        height: ['8px', '8px', '0.501vw'],
      },
      filledTrack: {
        bgColor: 'brand.secondary',
      },
      thumb: {
        bgColor: 'brand.secondary',
        _focus: {
          boxShadow: 'var(--chakra-colors-brand-secondary)',
        },
      },
    },
  },
  defaultProps: {
    variant: 'yellowSlider',
  },
};

export default Slider;
