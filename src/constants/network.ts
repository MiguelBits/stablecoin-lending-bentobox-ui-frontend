import { goerli } from 'wagmi/chains';

import { env } from 'lib/environment';

import { NetworkOption } from 'models/network';

import EthereumLogo from 'assets/logos/ethereum.svg';
// import ArbitrumLogo from 'assets/logos/arbitrum.svg';
// import AvalancheLogo from 'assets/logos/avalanche.svg';
// import FantomLogo from 'assets/logos/fantom.svg';
// import BinanceLogo from 'assets/logos/binance.svg';
// import PolygonLogo from 'assets/logos/polygon.svg';
// import OptimismLogo from 'assets/logos/optimism.svg';
// import MoonriverLogo from 'assets/logos/moonriver.svg';

export const SUPPORTED_NETWORKS = [
  goerli,
  ...(env.NEXT_PUBLIC_ENABLE_TESTNETS === true ? [goerli] : []),
];

export const DEFAULT_NETWORK =
  env.NEXT_PUBLIC_ENABLE_TESTNETS === true ? goerli : goerli;

// NOTE: DUMMY NETWORKS
export const networkOptions: NetworkOption[] = [
  {
    icon: EthereumLogo,
    label: 'ETH',
    value: 'ETH',
  },
  // TODO after launch
  // {
  //   icon: ArbitrumLogo,
  //   label: 'AETH',
  //   value: 'AETH',
  // },
  // {
  //   icon: AvalancheLogo,
  //   label: 'AVAX',
  //   value: 'AVAX',
  // },
  // {
  //   icon: FantomLogo,
  //   label: 'FTM',
  //   value: 'FTM',
  // },
  // {
  //   icon: BinanceLogo,
  //   label: 'BSC',
  //   value: 'BSC',
  // },
  // {
  //   icon: PolygonLogo,
  //   label: 'MATIC',
  //   value: 'MATIC',
  // },
  // {
  //   icon: OptimismLogo,
  //   label: 'OP',
  //   value: 'OP',
  // },
  // {
  //   icon: MoonriverLogo,
  //   label: 'MOONRIVER',
  //   value: 'MOONRIVER',
  // },
];
