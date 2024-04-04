import { Chain } from 'wagmi';

import { env } from 'lib/environment';

export const getChainDefaultAddressUrl = (
  chain: Chain | undefined,
  address: string
) => {
  if (!!chain) {
    return chain?.blockExplorers?.default.url + '/address/' + address;
  } else {
    if (env.NEXT_PUBLIC_ENABLE_TESTNETS === true) {
      return 'https://goerli.etherscan.io/address/' + address;
    } else {
      return 'https://etherscan.io/address/' + address;
    }
  }
};
