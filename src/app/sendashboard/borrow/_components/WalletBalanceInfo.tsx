import { As, Flex, HStack, Icon, Image, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import icons from 'base64-cryptocurrency-icons';

interface WalletBalanceInfoProps {
  token: string | As;
  tokenName: string;
  value: string;
}
const WalletBalanceInfo: React.FC<WalletBalanceInfoProps> = ({
  token,
  tokenName,
  value,
}) => {
  const activeToken = useMemo(() => {
    if (typeof token === 'string' && token.toLowerCase() === 'weth') {
      return {
        name: 'WETH',
        icon: '/images/collateralTokens/weth.png',
      };
    } else if (typeof token === 'string' && token.toLowerCase() === 'rusdc') {
      return {
        name: 'RUSDC',
        icon: '/images/collateralTokens/rusdc.png',
      };
    }
    if (token && typeof token === 'string') {
      return icons[token];
    }
    return icons['SEN'];
  }, [token]);

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <HStack spacing={[2, 2, '0.501vw']}>
        {token && typeof token === 'string' ? (
          <Image
            src={activeToken?.icon}
            alt={tokenName}
            w={['5', '5', '4', '8']}
            h={['5', '5', '4', '8']}
          />
        ) : (
          <Icon
            as={token as As}
            fontSize={['xl', 'xl', '2.553vw', '2.653vw', '1.653vw']}
          />
        )}
        <Text
          fontSize={['sm', 'md', 'md', 'md', '1.003vw']}
          color="brand.secondary"
        >
          {tokenName}
        </Text>
      </HStack>
      <Text
        fontSize={['sm', 'md', 'md', 'md', '1.003vw']}
        color="brand.secondary"
      >
        {value}
      </Text>
    </Flex>
  );
};

export default WalletBalanceInfo;
