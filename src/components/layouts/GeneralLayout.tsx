'use client';
import { Box, Circle, Container, Flex } from '@chakra-ui/react';

import Footer from 'components/Footer';

import Background from 'assets/backgrounds/background.svg';

interface GeneralLayoutProps {
  children: React.ReactNode;
}
const GeneralLayout: React.FC<GeneralLayoutProps> = ({ children }) => {
  return (
    <Flex
      bgColor="background.primary"
      minH="100vh"
      position="relative"
      flexDirection="column"
      flex="1"
    >
      <Box
        as={Background}
        position="absolute"
        top="0"
        left="0"
        right="0"
        zIndex={1}
      />
      <Circle
        size={['full', 'full', '31.111vw']}
        bgColor="rgba(232, 185, 106, 0.32)"
        position="absolute"
        left={[0, 0, '37%']}
        top={['-14rem', '-14rem', '-14.035vw']}
        filter={['blur(310.5px)', 'blur(19.455vw)']}
        zIndex={2}
      />
      <Flex
        as="main"
        role="main"
        direction="column"
        flex="1"
        position="relative"
        zIndex={3}
        mx={[4, 4, '1.003vw']}
        mb={[8, 8, '2.005vw']}
        overflow="hidden"
      >
        <Container
          maxW={['container.xl', 'container.xl', '80.201vw']}
          px={[1, 'auto']}
        >
          {children}
        </Container>
      </Flex>
      <Footer />
    </Flex>
  );
};

export default GeneralLayout;
