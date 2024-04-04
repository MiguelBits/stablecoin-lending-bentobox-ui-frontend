'use client';
import { Box, Center, Container } from '@chakra-ui/react';

import { LongLogo } from 'components/Logo';

import PasswordProtectForm from '@/app/verify/_forms/PasswordProtectForm';

const VerifyPage: React.FC = ({}) => {
  return (
    <Container
      h="100vh"
      maxW={['full', 'full', 'xs']}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box w="full">
        <Center mb={8}>
          <LongLogo w={['12.5rem', '12.5rem', '12.531vw']} />
        </Center>
        <PasswordProtectForm />
      </Box>
    </Container>
  );
};

export default VerifyPage;
