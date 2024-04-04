'use client';
import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Center,
  Grid,
  HStack,
  Heading,
  Text,
  Image,
  VStack,
  Flex,
  Divider,
  Button,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

import TokenLogo from 'assets/logos/token-logo.svg';

const Claim = () => {
  return (
    <Box>
      <Center mb={[0, 4, '1.003vw']}>
        <Heading
          fontSize={['4xl', '5xl', '6xl']}
          letterSpacing={['-0.52px', '-0.52px', '-0.033vw']}
          textAlign="center"
          fontWeight="400"
        >
          <Text as="span" color="white" pr={[3, 3, '0.752vw']}>
            CLAIM{' '}
          </Text>
          <Text as="span" fontStyle="italic" color="brand.secondary">
            SEN
          </Text>
        </Heading>
      </Center>
      <Card rounded={'md'}>
        <CardBody p={4} backgroundColor={''} mb={[0, 4, '1.003vw']}>
          <HStack spacing={[6, 6, '0,500vw']}>
            <InfoIcon
              color={'brand.secondary'}
              fontSize={['20', '20', '30', '40']}
            />
            <Text
              color={'text.secondary'}
              fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
              lineHeight="1.7"
            >
              Participants in the Airdrop, Early Contributors, and Private Sale
              may collect 10% of their tokens at TGE. The remaining tokens are
              vested over a three-month period.
            </Text>
            <Image as={TokenLogo} width={[60, 60, 400]} height={[40, 40, 60]} />
          </HStack>
        </CardBody>

        <CardBody p={2} backgroundColor={''} mb={[0, 4, '1.003vw']}>
          <Flex
            justifyContent="space-around"
            alignItems="center"
            height="100%"
            width={['100%', '100%', '100%', '50%']}
          >
            <VStack spacing={[6, 6, '0.500vw']} alignItems={'flex-start'}>
              <Text
                color={'text.secondary'}
                fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
              >
                Total
              </Text>
              <HStack
                color={'text.secondary'}
                fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
              >
                <Text
                  color={'text.secondary'}
                  fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
                >
                  0.00 / 0.00 SEN
                </Text>
              </HStack>
            </VStack>
            <Center height={'70px'} color={'text.secondary'}>
              <Divider orientation="vertical" />
            </Center>

            <VStack spacing={[6, 6, '0.500vw']} alignItems={'flex-start'}>
              <Text
                color={'text.secondary'}
                fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
              >
                Available
              </Text>
              <HStack
                color={'text.secondary'}
                fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
              >
                <Text
                  color={'text.secondary'}
                  fontSize={['sm', 'sm', 'sm', 'md', '1.003vw']}
                >
                  0.00 SEN
                </Text>
              </HStack>
            </VStack>

            <Button variant={'brandYellowFill'}>Claim</Button>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Claim;
