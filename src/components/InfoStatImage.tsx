import { Flex, Icon, HStack, Text, Tooltip, FlexProps } from '@chakra-ui/react';
import { GoInfo } from 'react-icons/go';

interface InfoStatImageProps extends FlexProps {
  tooltipLabel?: React.ReactNode;
  label: string;
  value: number | string | React.ReactNode;
}
const InfoStatImage: React.FC<InfoStatImageProps> = ({
  tooltipLabel = '',
  label,
  value,
  ...flexProps
}) => {
  return (
    <Flex
      alignItems={['flex-start', 'flex-start', 'center', 'flex-end']}
      flexDirection={['column', 'column', 'row']}
      // justifyContent="space-between"
      color="text.secondary"
      {...flexProps}
    >
      <HStack alignItems="center">
        {tooltipLabel && (
          <Tooltip label={tooltipLabel} shouldWrapChildren>
            <Icon as={GoInfo} cursor="help" fontSize={['md', 'md', 'lg']} />
          </Tooltip>
        )}
        <Text fontSize={['sm', 'sm', '0.877vw']} mb={[1, 1, '0.251vw']}>
          {label}
        </Text>
      </HStack>
      <Text fontSize={['sm', 'sm', '0.877vw']}>{value}</Text>
    </Flex>
  );
};

export default InfoStatImage;
