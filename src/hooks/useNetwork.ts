import { useEffect, useState } from 'react';
import { Chain, useNetwork as useWagmiNetwork } from 'wagmi';

import { DEFAULT_NETWORK, SUPPORTED_NETWORKS } from 'constants/network';

interface WagmiChain extends Chain {
  unsupported?: boolean;
}

const useNetwork = () => {
  const [chain, setChain] = useState<WagmiChain>(DEFAULT_NETWORK);
  const [chains, setChains] = useState<WagmiChain[]>(SUPPORTED_NETWORKS);
  const { chain: wagmiChain, chains: wagmiChains } = useWagmiNetwork();

  useEffect(() => {
    if (!!wagmiChain) {
      setChain(wagmiChain);
    } else {
      setChain(DEFAULT_NETWORK);
    }
  }, [wagmiChain]);

  useEffect(() => {
    if (!!wagmiChains && wagmiChains.length > 0) {
      setChains(wagmiChains);
    } else {
      setChains(SUPPORTED_NETWORKS);
    }
  }, [wagmiChains]);

  return { chain, chains };
};

export default useNetwork;
