import { Button, HStack, Icon, Stack, Text, VStack } from '@chakra-ui/react';
import { formatUnits } from 'ethers';

import TokenLogo from 'assets/logos/token-logo.svg';

import formatTimestamp from '@/components/vesen/RealTimeDisplay';
import { UserLockData } from '@/hooks/useUserLockDataSync';

interface LockItemProps {
  LockData: UserLockData;
}

const LockItem: React.FC<LockItemProps> = ({ LockData }) => {
  return (
    <Stack
      spacing={0}
      direction={['column', 'column', 'row']}
      alignItems={['flex-start', 'flex-start', 'center']}
      justifyContent={['center', 'center', 'space-between']}
      py={[6, 6, '0.501vw']}
      borderBottom="1px solid rgba(232, 185, 106, 0.12)"
    >
      {/* Render lock data */}
      <VStack alignItems={['flex-start', 'flex-start', 'center']} spacing={3}>
        <HStack>
          <Icon as={TokenLogo} w={[6, 6, '1vw']} h={[6, 6, '1vw']} />
          <Text fontSize={['md', 'md', '0.803vw']} color="white" marginLeft={0}>
            SEN Amount
          </Text>
        </HStack>
        <Text fontSize={['md', 'md', '1.003vw']} color="white" marginLeft={0}>
          {formatUnits(LockData?.amount || '0', 18)}
        </Text>
      </VStack>

      <VStack alignItems={['flex-start', 'flex-start', 'center']} spacing={3}>
        <Text fontSize={['md', 'md', '0.803vw']} color="white" marginLeft={0}>
          Expires On
        </Text>
        <Text fontSize={['md', 'md', '1.003vw']} color="white" marginLeft={0}>
          {/* @ts-ignore temporaly*/}
          {LockData ? formatTimestamp(LockData.start) : 'Loading...'}
        </Text>
      </VStack>

      <HStack justifyContent={['center', 'center', 'flex-end']} spacing={3}>
        <Button
          variant="brandYellowFill"
          w={['100%', '100%', 'fit-content', '50%']}
          fontSize={['md', 'md', '0.778vw']}
          style={{ textTransform: 'none', textDecoration: 'none' }}
          fontStyle={'none'}
        >
          Renew
        </Button>

        <Button
          color="white"
          w={['100%', '100%', 'fit-content', '40%']}
          fontSize={['md', 'md', '0.778vw']}
          border="1px solid rgba(232, 185, 106, 0.12)"
          backgroundColor="rgba(232, 185, 106, 0.2)"
          _hover={{ backgroundColor: 'rgba(232, 185, 106, 0.5)' }}
        >
          Claim
        </Button>
      </HStack>
    </Stack>
  );
};

export default LockItem;
