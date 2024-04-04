import React from 'react';
import { Text } from '@chakra-ui/react';

import { useVesenContext } from '@/contexts/vesenContext';

function formatTimestamp(epochTimestamp: bigint) {
  const date = new Date(Number(epochTimestamp) * 1000); // Multiply by 1000 to convert to milliseconds
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();
  //console.log('epoch', epochTimestamp);

  return `${formattedDate} ${formattedTime}`;
}
function RealTimeDisplay() {
  const vesenContext = useVesenContext();

  // Access the data from the context
  const currentEpoch = vesenContext.currentEpoch;
  const epoch1Time = vesenContext.epoch1Time;
  const epochDuration = vesenContext.epochDuration;
  const epochsPerLock = vesenContext.epochsPerLock;

  // Calculate the timestamp for the end of the epoch in which the lock ends
  let lockEndEpochTimestamp: bigint | undefined;
  if (
    currentEpoch !== undefined &&
    epochDuration !== undefined &&
    epoch1Time !== undefined &&
    epochsPerLock !== undefined
  ) {
    const lockEndEpoch = currentEpoch + epochsPerLock;
    const lockEndEpochTimestampInSeconds =
      epoch1Time + epochDuration * lockEndEpoch;
    lockEndEpochTimestamp = BigInt(lockEndEpochTimestampInSeconds);
  }

  // Use the data in your component
  return (
    <div>
      <Text fontSize={['md', 'md', '1.003vw']}>
        {' '}
        {lockEndEpochTimestamp !== undefined
          ? formatTimestamp(lockEndEpochTimestamp)
          : 'N/A'}
      </Text>
    </div>
  );
}

export default RealTimeDisplay;
