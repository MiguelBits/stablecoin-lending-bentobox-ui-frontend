import { useContractReads } from 'wagmi';

import { useContractContext } from 'contexts/contractContext';

import { useVesenContext } from '@/contexts/vesenContext';

export interface UserLockData {
  amount: string;
  start: number;
  renewal: boolean;
  endTimestamp: string;
}

const useUserLockDataSync = (
  address: any,
  index: number
): UserLockData | null => {
  const { userLockCount } = useVesenContext();
  const currentLockCount = userLockCount ? Number(userLockCount.toString()) : 0;
  const { contracts } = useContractContext();

  const { data: vesenContractData } = useContractReads({
    contracts: [
      {
        ...contracts.VESEN,
        functionName: 'getUserLock',
        args: [address, index],
      },
    ],
    select: (data) => {
      return data
        .filter((item) => {
          return item && item.result;
        })
        .map((item) => {
          return item.result;
        });
    },
  });

  // const { data: actualTimeStampData } = useContractReads({
  //   contracts: [
  //     {
  //       ...contracts.VESEN,
  //       functionName: 'currentEpoch',
  //     },
  //   ],
  //   select: (data) => {
  //     return data
  //       .filter((item) => {
  //         return item && item.result;
  //       })
  //       .map((item) => {
  //         return item.result;
  //       });
  //   },
  // });

  if (vesenContractData && vesenContractData.length > 0) {
    const result = vesenContractData[0] as unknown[];
    if (result.length >= 3) {
      const startEpoch = Number(result[1]);
      const epochsPerLock = 16;
      const epochDuration = 600;
      const epoch1Time = 1691312400;
      // const endEpoch = startEpoch + epochsPerLock;
      // const lockEndEpochTimestampInSeconds = epochDuration * endEpoch;

      const expirationTimestampInSeconds =
        epoch1Time + startEpoch * epochDuration + epochsPerLock * epochDuration;

      const expirationDate = new Date(expirationTimestampInSeconds * 1000);

      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC',
      });

      const formattedExpirationDate = dateFormatter.format(expirationDate);

      return {
        amount: result[0] as string,
        start: startEpoch,
        renewal: result[2] as boolean,
        endTimestamp: formattedExpirationDate,
      };
    }
  }

  const userLocksData: UserLockData[] = [];

  for (let index = 0; index < currentLockCount; index++) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const lockData = useUserLockDataSync(address, index);
    if (lockData) {
      userLocksData.push(lockData);
    }
  }

  return null;
};

export default useUserLockDataSync;
