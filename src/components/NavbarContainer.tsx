import { Box, BoxProps, Center } from '@chakra-ui/react';

interface NavBarContainerProps extends BoxProps {
  children: React.ReactNode;
}
const NavBarContainer: React.FC<NavBarContainerProps> = ({
  children,
  ...boxProps
}) => {
  return (
    <Center>
      <Box
        bg="blackAlpha.300"
        display="inline-flex"
        position="relative"
        borderRadius="3.75rem"
        transition="all 0.3s ease"
        pl={[4, 4, '1.003vw']}
        pr={[6, 6, '1.504vw']}
        my={[8, 8, '2.005vw']}
        zIndex="1"
        boxShadow="0px 4px 12px rgba(0, 0, 0, 0.24)"
        minW={['full', 'full', '42.106vw']}
        {...boxProps}
      >
        <Box
          _before={{
            zIndex: '-1',
            content: '""',
            position: 'absolute',
            inset: 0,
            transition: 'all 0.3s ease',
            borderRadius: '3.75rem',
            padding: '0.7px' /* control the border thickness */,
            filter: 'blur(4.5px)',
            background:
              'radial-gradient(circle, rgba(232,185,106,1) 5%, rgba(232,185,106, 0.16) 80%), rgba(232,185,106,0.16) 100%',
            '-webkit-mask':
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            '-webkit-mask-composite': 'xor',
            'mask-composite': 'exclude',
          }}
        />

        {children}
      </Box>
    </Center>
  );
};

export default NavBarContainer;
