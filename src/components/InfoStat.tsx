import { Flex, Icon, HStack, Text, Tooltip, FlexProps } from '@chakra-ui/react';
import { GoInfo } from 'react-icons/go';

interface InfoStatProps extends FlexProps {
  tooltipLabel?: string;
  label: string;
  value: number | string | React.ReactNode;
}
const InfoStat: React.FC<InfoStatProps> = ({
  tooltipLabel = '',
  label,
  value,
  ...flexProps
}) => {
  return (
    <Flex
      alignItems={['flex-start', 'flex-start', 'center']}
      flexDirection={['column', 'column', 'row']}
      justifyContent="space-between"
      color="text.secondary"
      {...flexProps}
    >
      <HStack alignItems="center" spacing={[4, 4, '1.003vw']}>
        {tooltipLabel && (
          <Tooltip
            label={tooltipLabel}
            shouldWrapChildren
            fontSize={['md', 'md', 'md', 'md', '1.003vw']}
          >
            <Icon
              as={GoInfo}
              cursor="help"
              fontSize={['md', 'md', 'md', 'md', '1.003vw']}
            />
          </Tooltip>
        )}
        <Text
          fontSize={['sm', 'sm', 'md', 'md', '1.003vw']}
          mb={[1, 1, '0.251vw']}
        >
          {label}
        </Text>
      </HStack>
      <Text fontSize={['sm', 'sm', 'md', 'md', '1.003vw']}>{value}</Text>
    </Flex>
  );
};

export default InfoStat;
