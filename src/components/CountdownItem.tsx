import { Stack, Text } from '@chakra-ui/react';

interface CountdownItemProps {
  item: number;
  label: string;
}

const CountdownItem: React.FC<CountdownItemProps> = ({ item, label }) => {
  return (
    <Stack align="center" spacing={0}>
      <Text fontSize={['lg', '2xl', '1.504vw']} fontWeight="600">
        {item}
      </Text>
      <Text
        fontSize={['sm', 'md', '1.003vw']}
        fontWeight="500"
        textTransform="capitalize"
      >
        {label}
      </Text>
    </Stack>
  );
};

export default CountdownItem;
