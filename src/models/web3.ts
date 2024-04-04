import BigNumber from 'bignumber.js';
import { BigNumberish } from 'ethers';

export interface Balance {
  value: bigint | BigNumber | BigNumberish;
  formatted: string;
  decimals?: number;
  symbol?: string;
}
