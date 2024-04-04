import {
  Flex,
  HStack,
  Icon,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  useDisclosure,
  useRadioGroup,
} from '@chakra-ui/react';
import { FaGear } from 'react-icons/fa6';

import CustomRadio from 'components/CustomRadio';

import SlippageModal from '@/app/sendashboard/leverage/_modals/SlippageModal';
import InfoStat from '@/components/InfoStat';

const LeverageSettings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getRadioProps } = useRadioGroup({
    name: '0.25',
    defaultValue: '0.25',
    onChange: console.log,
  });
  return (
    <Stack spacing={[6, 6, '1.504vw']}>
      <Flex
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
        gap={[2, 2, '0.501vw']}
      >
        <HStack>
          {/* <InfoStat label="Leverage up"  color="white">
            <Icon as={GoInfo} cursor="help" pt={[0.5, 0.5, '0.125vw']} color="text.secondary"/>
          </InfoStat> */}
          <InfoStat tooltipLabel="Leverage up" label="Leverage up" value="" />
          {/* <Text fontSize={['sm', 'sm', '0.877vw']} color="text.secondary">
            Leverage up
          </Text> */}
        </HStack>
        <HStack>
          <Text
            fontSize={['sm', 'sm', '0.877vw']}
            color="text.secondary"
            fontWeight="500"
          >
            1.00% Slippage
          </Text>
          <Icon
            as={FaGear}
            fontSize={['sm', 'sm', '0.877vw']}
            cursor="pointer"
            color="text.secondary"
            transition="all 0.3s ease"
            onClick={onOpen}
            _hover={{
              color: 'brand.secondary',
            }}
          />
          <SlippageModal isOpen={isOpen} onClose={onClose} />
        </HStack>
      </Flex>
      <Slider aria-label="slider-ex-1" defaultValue={70} zIndex={0}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Flex
        w="full"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="md"
        border="1px solid rgba(232, 185, 106, 0.12)"
        py={[1, 1, '0.251vw']}
        px={[2, 2, '0.501vw']}
        mt={[2, 2, '0.501vw']}
        overflow="auto"
        sx={{
          '&::-webkit-scrollbar': {
            height: '6px',
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'dash.tooltip',
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'background.tertiary',
            borderRadius: '24px',
          },
        }}
      >
        <CustomRadio {...getRadioProps({ value: '0.25' })}>25%</CustomRadio>
        <CustomRadio {...getRadioProps({ value: '0.50' })}>50%</CustomRadio>
        <CustomRadio {...getRadioProps({ value: '0.70' })}>70%</CustomRadio>
        <CustomRadio {...getRadioProps({ value: '1' })}>100%</CustomRadio>
        <CustomRadio {...getRadioProps({ value: '0.0' })}>Custom</CustomRadio>
      </Flex>
    </Stack>
  );
};

export default LeverageSettings;
