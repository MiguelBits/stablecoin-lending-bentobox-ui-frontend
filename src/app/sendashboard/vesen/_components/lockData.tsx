import { Stack } from '@chakra-ui/react';

import { UserLockData } from '@/hooks/useUserLockDataSync';
import LockItem from 'app/sendashboard/vesen/_components/LockItem';

interface ViewLocksProps {
  userLocksData: UserLockData[];
}

const LockData: React.FC<ViewLocksProps> = ({ userLocksData }) => {
  return (
    <Stack spacing={0}>
      {userLocksData.map((lockData, index) => {
        return <LockItem key={index} LockData={lockData} />;
      })}
    </Stack>
  );
};

export default LockData;
