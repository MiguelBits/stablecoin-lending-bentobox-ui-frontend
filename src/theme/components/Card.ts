import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle } = createMultiStyleConfigHelpers(cardAnatomy.keys);

const Card = {
  baseStyle: definePartsStyle({
    container: {
      border: '1px solid rgba(232,185,106,0.12)',
      backgroundColor: 'background.primary',
    },
  }),
  variants: {},
  defaultProps: {},
};

export default Card;
