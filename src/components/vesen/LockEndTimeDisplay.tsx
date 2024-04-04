import React from 'react';
import { Text } from '@chakra-ui/react';

import { useVesenContext } from '@/contexts/vesenContext';

function formatExpiryTimestamp(epochTimestamp: bigint) {
  const date = new Date(Number(epochTimestamp) * 1000); // Multiply by 1000 to convert to milliseconds
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();
  //console.log('epoch', epochTimestamp);

  return `${formattedDate} ${formattedTime}`;
}
function LockEndTimeDisplay() {
  const vesenContext = useVesenContext();

  const currentEpoch = vesenContext.currentEpoch;
  const epoch1Time = vesenContext.epoch1Time;
  const epochDuration = vesenContext.epochDuration;
  const epochsPerLock = vesenContext.epochsPerLock;

  let lockEndEpochTimestamp: bigint | undefined;
  if (
    currentEpoch !== undefined &&
    epochDuration !== undefined &&
    epoch1Time !== undefined &&
    epochsPerLock !== undefined
  ) {
    const lockEndEpoch = currentEpoch + epochsPerLock;
    const expirationTimestamp = lockEndEpoch * epochDuration;

    const lockerEndEpochTimestampInSeconds = epoch1Time + expirationTimestamp;

    lockEndEpochTimestamp = BigInt(lockerEndEpochTimestampInSeconds);
  }

  return (
    <div>
      <Text fontSize={['md', 'md', '1.003vw']}>
        {' '}
        {lockEndEpochTimestamp !== undefined
          ? formatExpiryTimestamp(lockEndEpochTimestamp)
          : 'N/A'}
      </Text>
    </div>
  );
}

export default LockEndTimeDisplay;
