import { useAccount, useContractRead } from 'wagmi';
import { Abi } from 'viem';

import useNetwork from 'hooks/useNetwork';

import { useContractContext } from 'contexts/contractContext';

import vesenAbi from 'contracts/abi/vesenAbi.json';
import bptAbi from 'contracts/abi/bptAbi.json';

const useVesen = (vesenAddress: `0x${string}`) => {
  const { address } = useAccount();
  const { contracts } = useContractContext();
  const { chain } = useNetwork();

  const vesenContract = {
    address: vesenAddress,
    abi: vesenAbi as Abi,
    chainId: chain.id,
  };

  const bptContract = {
    address: contracts.SVESEN?.address,
    abi: bptAbi as Abi,
    chainId: chain.id,
  };

  const { data: locks } = useContractRead({
    ...vesenContract,
    functionName: 'locks',
    args: [address as `0x${string}`],
  });

  const { data: epoch1Time } = useContractRead({
    ...vesenContract,
    functionName: 'epoch1Time',
  });

  const { data: epochDuration } = useContractRead({
    ...vesenContract,
    functionName: 'epochDuration',
  });

  return {
    locks: locks,
    epoch1Time: Number(epoch1Time) || 0,
    epochDuration: Number(epochDuration) || 0,
    bptContract,
  };
};

export default useVesen;
