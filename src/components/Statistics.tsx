import { Stack, Text } from '@chakra-ui/react';

interface StatisticsProps {
  label: string;
  value: number | string;
  color?: string;
}
const Statistics: React.FC<StatisticsProps> = ({ label, value, color }) => {
  return (
    <Stack>
      <Text
        color="text.secondary"
        fontSize={['sm', 'sm', 'sm', 'md', '0.877vw']}
      >
        {label}
      </Text>
      <Text
        color={color || 'white'}
        fontFamily="heading"
        fontSize={['2rem', '2rem', '2.005vw']}
        letterSpacing={['-0.32px', '-0.32px', '-0.020vw']}
        lineHeight={[8, 8, '2.005vw']}
      >
        {value}
      </Text>
    </Stack>
  );
};

export default Statistics;
