import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useChainModal } from '@rainbow-me/rainbowkit';

import useNetwork from 'hooks/useNetwork';

import { DEFAULT_NETWORK } from 'constants/network';
import {
  ContractAddressProps,
  ContractAddressesProps,
  contractAddresses,
} from 'constants/contractAddresses';

interface ContractProviderProps {
  children: React.ReactNode;
}

interface ContractContextProps {
  contracts: ContractAddressProps;
}

const DEFAULT_ACTIVE_NETWORK: keyof ContractAddressesProps = DEFAULT_NETWORK.id;

export const initialContractState = {
  contracts: contractAddresses[DEFAULT_ACTIVE_NETWORK],
};

export const ContractContext = createContext<ContractContextProps>({
  ...initialContractState,
});

export const ContractProvider: React.FC<ContractProviderProps> = ({
  children,
}) => {
  const { chain } = useNetwork();
  const { openChainModal } = useChainModal();

  const { address: accountAddress } = useAccount();

  const [contracts, setContracts] = useState(
    contractAddresses[DEFAULT_ACTIVE_NETWORK]
  );

  useEffect(() => {
    if (chain?.id && !chain.unsupported) {
      setContracts(contractAddresses[chain.id]);
    } else {
      setContracts(contractAddresses[DEFAULT_ACTIVE_NETWORK]);
      openChainModal?.();
    }
  }, [chain, accountAddress, openChainModal]);

  return (
    <ContractContext.Provider
      value={{
        contracts,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContractContext = () => {
  return useContext(ContractContext);
};
