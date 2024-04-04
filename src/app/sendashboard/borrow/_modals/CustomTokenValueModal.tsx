import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  useToken,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import hexToRgba from 'hex-to-rgba';

import ModalOverlay from 'components/ModalOverlay';

import { useBorrowContext } from 'contexts/borrowContext';

import CollateralAssetMenu from 'app/sendashboard/borrow/_components/CollateralAssetMenu';

interface CustomTokenValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const CustomTokenValueModal: React.FC<CustomTokenValueModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [brandSecondary] = useToken('colors', ['brand.secondary']);
  const { setValue, watch } = useFormContext();
  const { activeCollateralToken, collateralTokenBalance } = useBorrowContext();
  const [percentageValue, setPercentageValue] = useState(0);

  const handlePercentageChange = (value: string) => {
    const percentageValue = Number(value);
    setPercentageValue(percentageValue);

    const balanceValue = Number(collateralTokenBalance?.value) || 0;
    const collateralAmountValue = (percentageValue / 100) * balanceValue;
    setValue('collateralAmount', collateralAmountValue);
  };

  const handleCollateralAmountChange = (e: { target: { value: any } }) => {
    const inputValue = e.target.value;

    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      const collateralAmountValue = Number(inputValue);
      setValue('collateralAmount', collateralAmountValue);

      const balanceValue = Number(collateralTokenBalance?.value) || 0;

      if (collateralAmountValue >= 0) {
        setPercentageValue((collateralAmountValue / balanceValue) * 100);
      }
    }
  };

  const onHandleOk = () => {
    onSave();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="white">SETTINGS</ModalHeader>
        <ModalCloseButton color="text.secondary" />
        <ModalBody px={[8, 8, '2.005vw']} py={[8, 8, '2.005vw']}>
          <Stack spacing={[4, 4, '1.003vw']}>
            <Stack>
              <Text
                fontSize={['sm', 'sm', '0.972vw']}
                display="flex"
                justifyContent="space-between"
                color="brand.secondary"
              >
                <Text>Balance</Text>
                <Text>
                  {collateralTokenBalance?.formatted?.toLocaleString()}{' '}
                  {activeCollateralToken?.symbol}
                </Text>
              </Text>
              <CollateralAssetMenu w="full" />
            </Stack>

            <FormControl>
              <FormLabel
                color="text.secondary"
                fontSize={['sm', 'sm', '0.877vw']}
              >
                Collateral Asset
              </FormLabel>
              <InputGroup>
                <Input
                  _hover={{
                    borderColor: 'none',
                  }}
                  readOnly
                  placeholder="0"
                  type="number"
                  value={watch('collateralAmount')}
                  onChange={handleCollateralAmountChange}
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel
                color="text.secondary"
                fontSize={['sm', 'sm', '0.972vw']}
              >
                <Text>Custom Percentage</Text>
              </FormLabel>
              <NumberInput
                defaultValue={percentageValue}
                precision={4}
                step={0.2}
                onChange={(value) => {
                  handlePercentageChange(value);
                }}
                max={100}
                clampValueOnBlur
                keepWithinRange
                color="whiteAlpha.400"
              >
                <NumberInputField
                  _hover={{
                    borderColor: `${hexToRgba(brandSecondary, 0.5)}`,
                  }}
                  _focusVisible={{
                    borderColor: `${hexToRgba(brandSecondary, 0.5)}`,
                    boxShadow: 'none !important',
                  }}
                  borderColor={`${hexToRgba(brandSecondary, 0.12)}`}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <Button
              variant="brandYellowFill"
              w="full"
              type="button"
              onClick={onHandleOk}
            >
              Ok
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomTokenValueModal;
