import { Box, Center, Text, VStack } from '@chakra-ui/react';

const ComingSoon = () => {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0, 0, 0, 0.5)" // Adjust opacity as needed
      zIndex={10} // Make sure it's above your content
      display="flex"
      alignItems="center"
      justifyContent="center"
      pointerEvents={'none'}
      //   backdropFilter="blur(10px)" // Apply the blur filter
      height="100%"
    >
      <Text fontSize="3xl" fontWeight="bold" color="white">
        Coming Soon
      </Text>
    </Box>
  );
};

export default ComingSoon;
