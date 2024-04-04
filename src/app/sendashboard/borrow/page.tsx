'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  ColorModeContext,
  Flex,
  Grid,
  Heading,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';

import BorrowStatistics from 'components/borrow/BorrowStatistics';
import BorrowForm from 'components/borrow/BorrowForm';

import { BorrowProvider } from 'contexts/borrowContext';
import { OracleProvider } from 'contexts/oracleContext';

import { useToggle } from '@/hooks/useSwitch';
import { ColorProvider } from '@/contexts/colorContext';

const Borrow = () => {
  const methods = useForm();
  const amountValue = 0;
  const amountPricedValue = 0;
  const { toggle } = useToggle();
  const [isWithdraw, setIsWithdraw] = useState(false);
  const searchParams = useSearchParams();
  const [urlWithdraw, setUrlWithdraw] = useState<string | null>(null);

  const toggleMode = () => {
    setIsWithdraw(!isWithdraw);
  };

  useEffect(() => {
    setUrlWithdraw(searchParams?.get('isWithdraw') || null);
    if (urlWithdraw) {
      toggleMode();
    }
  }, [urlWithdraw]);

  const withdrawTextColor = isWithdraw ? 'brand.secondary' : 'text.secondary';
  const borrowTextColor = !isWithdraw ? 'brand.secondary' : 'text.secondary';

  return (
    <BorrowProvider>
      <ColorProvider>
        <OracleProvider amount={amountValue} amountPriced={amountPricedValue}>
          <FormProvider {...methods}>
            <Box>
              <Center mb={[0, 4, '1.003vw']}>
                <Heading
                  fontSize={['4xl', '5xl', '6xl']}
                  letterSpacing={['-0.52px', '-0.52px', '-0.033vw']}
                  textAlign="center"
                  fontWeight="400"
                >
                  <Text as="span" color="white" pr={[3, 3, '0.752vw']}>
                    BORROW{' '}
                  </Text>
                  <Text as="span" fontStyle="italic" color="brand.secondary">
                    SENECA
                  </Text>
                  <Stack
                    direction="row"
                    justifyContent="center"
                    mt={[4, 4, 4, 8, '2.010vw']}
                    cursor={'pointer'}
                  >
                    <Flex alignItems="center">
                      <Text
                        color={borrowTextColor}
                        fontSize={['2xl', '4xl', '2.008vw']}
                        textTransform="inherit"
                      >
                        Borrow
                      </Text>
                      <Switch
                        colorScheme="yellow"
                        px={4}
                        size="md"
                        isChecked={isWithdraw}
                        // The Switch is now directly clickable
                        onChange={toggleMode}
                      />
                      <Text
                        fontSize={['2xl', '4xl', '2.008vw']}
                        color={withdrawTextColor}
                      >
                        Withdraw
                      </Text>
                    </Flex>
                  </Stack>
                  <Button
                    onClick={toggleMode}
                    variant="brandYellowFill"
                    mt={[4, 4, 4, 6, 6]}
                    fontSize={['2xl', '4xl', '2xl', '2xl']}
                    textTransform="inherit"
                  >
                    Switch mode
                  </Button>
                </Heading>
              </Center>
              <Card>
                <CardBody p={0}>
                  <Grid
                    templateRows={['auto', 'auto', 'auto', 'auto', '1fr 0.7fr']}
                    templateColumns={[
                      '1fr',
                      '1fr',
                      '1fr',
                      '1fr',
                      'repeat(4, 1fr)',
                    ]}
                    gridAutoFlow={['row', 'row', 'row', 'row', 'column']}
                  >
                    <BorrowForm isWithdraw={isWithdraw} />
                    <BorrowStatistics isWithdraw={isWithdraw} />
                  </Grid>
                </CardBody>
              </Card>
            </Box>
          </FormProvider>
        </OracleProvider>
      </ColorProvider>
    </BorrowProvider>
  );
};

export default dynamic(
  () => {
    return Promise.resolve(Borrow);
  },
  { ssr: false }
);
