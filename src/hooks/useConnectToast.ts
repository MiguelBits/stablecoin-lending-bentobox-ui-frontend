import { useToast } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

interface Account {
  address: string;
  balanceDecimals?: number;
  balanceFormatted?: string;
  balanceSymbol?: string;
  displayBalance?: string;
  displayName: string;
  ensAvatar?: string;
  ensName?: string;
  hasPendingTransactions: boolean;
}

const useConnectToast = (account?: Account | null) => {
  const toastShownRef = useRef(false);
  const connectShownRef = useRef(false);
  const toast = useToast();

  useEffect(() => {
    if (!account && !toastShownRef.current) {
      toastShownRef.current = true;
      toast({
        description: 'Please connect your wallet',
        status: 'warning',
        variant: 'warning',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    } else if (account && !connectShownRef.current) {
      connectShownRef.current = true;
      toast({
        description: 'Wallet is connected',
        status: 'success',
        variant: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [account, toast]);
};

export default useConnectToast;
