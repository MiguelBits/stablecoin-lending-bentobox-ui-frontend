import { Center, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import Countdown from 'react-countdown';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';
import { useMemo } from 'react';

import CountdownItem from 'components/CountdownItem';

import { useSaleContext } from 'contexts/saleContext';

interface TimeProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(advanced);

const SaleCountdownTimer = () => {
  const { saleEndDate } = useSaleContext();

  const formattedSaleEndDate = useMemo(() => {
    return dayjs(saleEndDate).utc().format('MMMM DD, YYYY hh:mm A z');
  }, [saleEndDate]);

  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: TimeProps) => {
    if (completed) {
      return (
        <Center
          mb={[6, 6, '1.667vw']}
          color="brand.secondary"
          textDecoration="underline"
        >
          <Heading>THE SALE HAS ENDED</Heading>
        </Center>
      );
    } else {
      return (
        <Center display="flex" flexDirection="column">
          <Stack spacing={[3, 3, '0.833vw']}>
            <Text textAlign="center" color="text.secondary">
              Private Sale Ends In
            </Text>
            <Flex
              flexWrap="wrap"
              gap={[3, 3, '0.833vw']}
              mb={[6, 6, '1.667vw']}
              alignItems="center"
              justifyContent="center"
            >
              <CountdownItem item={days} label="Days" />
              <Text fontSize={['lg', 'lg', '1.250vw']} fontWeight="700">
                :
              </Text>
              <CountdownItem item={hours} label="Hours" />
              <Text fontSize={['lg', 'lg', '1.250vw']} fontWeight="700">
                :
              </Text>
              <CountdownItem item={minutes} label="Minutes" />
              <Text fontSize={['lg', 'lg', '1.250vw']} fontWeight="700">
                :
              </Text>
              <CountdownItem item={seconds} label="Seconds" />
            </Flex>
          </Stack>
        </Center>
      );
    }
  };
  return (
    <Countdown date={formattedSaleEndDate} autoStart renderer={renderer} />
  );
};

export default SaleCountdownTimer;
