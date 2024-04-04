'use client';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import {
  RainbowKitProvider,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
  rainbowWallet,
  injectedWallet,
  walletConnectWallet,
  coinbaseWallet,
  metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura';
import BigNumber from 'bignumber.js';

import CustomAvatar from 'components/CustomAvatar';

import { env } from 'lib/environment';

import { ContractProvider } from 'contexts/contractContext';
import { SaleProvider } from 'contexts/saleContext';

import { rainbowKitCustomTheme } from 'constants/rainbowKitCustomTheme';
import { SUPPORTED_NETWORKS } from 'constants/network';

import theme from 'theme';

const projectId = env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID;
const appName = 'Seneca App';

BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const { chains, publicClient, webSocketPublicClient } = configureChains(
  SUPPORTED_NETWORKS,
  [
    alchemyProvider({ apiKey: env.NEXT_PUBLIC_ALCHEMY_KEY }),
    infuraProvider({ apiKey: env.NEXT_PUBLIC_INFURA_KEY }),
    publicProvider(),
  ]
);

const appInfo = {
  appName: appName,
};

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
      coinbaseWallet({ appName, chains }),
      metaMaskWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      rainbowWallet({ projectId, chains }),
    ],
  },
  {
    groupName: 'Other',
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  connectors,
  webSocketPublicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          appInfo={appInfo}
          avatar={CustomAvatar}
          theme={rainbowKitCustomTheme}
          chains={chains}
        >
          <ChakraProvider
            theme={theme}
            toastOptions={{ defaultOptions: { position: 'top-right' } }}
          >
            <ContractProvider>
              <SaleProvider>
                <ColorModeScript
                  initialColorMode={theme.config.initialColorMode}
                />
                {children}
              </SaleProvider>
            </ContractProvider>
          </ChakraProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </CacheProvider>
  );
}
