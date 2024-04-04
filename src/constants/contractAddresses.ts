import { erc20ABI } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';

import saleAbi from 'contracts/abi/senecaSale.json';
import stableCoinAbi from 'contracts/abi/senecaStableCoin.json';
import stableEngineAbi from 'contracts/abi/stableEngine.json';
import usdtAbi from 'contracts/abi/usdtAbi.json';
import faucetAbi from 'contracts/abi/faucetAbi.json';
import oracleAbi from 'contracts/abi/oracle.json';
import registryAbi from 'contracts/abi/registryAbi.json';
import rewardsDistributor from 'contracts/abi/rewardsDistributor.json';
// import erc20MockAbi from 'contracts/abi/erc20MockAbi.json';
import vesenAbi from 'contracts/abi/vesenAbi.json';
import sSen from 'contracts/abi/sSen.json';
import senecaToken from 'contracts/abi/senecaToken.json';
import market from 'contracts/abi/market.json';
import Ibentobox from 'contracts/abi/Ibentobox.json';
import IbentoBox2 from 'contracts/abi/IbentoBox2.json';

export interface ContractAddressProps {
  [key: string]: {
    address: `0x${string}`;
    abi: any;
  };
}

export interface ContractAddressesProps {
  [key: number]: ContractAddressProps;
}

export const contractAddresses: ContractAddressesProps = {
  [mainnet.id]: {
    // TOKENS
    SENECA_SALE: {
      address: '0x22B3c9af7A9d47939719b14C8969100370514ff8',
      abi: saleAbi,
    },
    USDT: {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      abi: usdtAbi,
    },
    // SEN: '0x',
  },
  [goerli.id]: {
    REGISTRY: {
      address: '0x917679Ab05391140B4323E82Dd0e2007378d4d1E',
      abi: registryAbi,
    },
    USDT: {
      address: '0xC719bB3c0FD98E86cB98B9507BAB2db2AA47774F',
      abi: erc20ABI,
    }, //MockUSDT
    SENECA_SALE: {
      address: '0xEae5b1B7392007273730984A6dBCFfB5Fdc0aA08',
      abi: saleAbi,
    }, // private sale
    SEN: {
      address: '0x7c2208a5aC67681dEE411af3FDAa7235e8b468d6',
      abi: erc20ABI,
    }, //stable coin
    STETH_ENGINE: {
      address: '0x52eb9536C9210dcB9e47eF7D3D4bEAbe644b72D9',
      abi: stableEngineAbi,
    },
    WETH_ENGINE: {
      address: '0x24C3b482Af31ee869fFDAe9ff983123209e256a9',
      abi: Ibentobox,
    },
    RUSDC_ENGINE: {
      address: '0x57BFE0B2f5f446ea3C30b61a2030c1B58D029aFC',
      abi: stableEngineAbi,
    },
    STABLE_ENGINE: {
      address: '0x917679Ab05391140B4323E82Dd0e2007378d4d1E',
      abi: stableEngineAbi,
    },
    OLD_ENGINE: {
      address: '0xe2E62A3523cE749369708f3b59BBeA6a3d5Fd387',
      abi: stableEngineAbi,
    },
    ORACLE: {
      address: '0x1552Ba15bB32e0FEfb69541C9074E8291E7761b8',
      abi: oracleAbi,
    }, // oracle
    WETH: {
      address: '0x7A51f19c68181759D4827cB623D70Dfd6110Cab7',
      abi: erc20ABI,
    }, //ERC20Mock wethMOCK
    STETH: {
      address: '0xcA4518213D220BD1F3ABc47b0E8C5934d10FE6d3',
      abi: erc20ABI,
    }, //ERC20Mock stethMock
    RUSDC: {
      address: '0xacc31CDA05C871Be8431Eba2dC17a37c61a94B1F',
      abi: erc20ABI,
    }, //ERC20Mock rbtcMOCK
    VESEN: {
      address: '0xb9F89C0e0B1DcC5D031627245Df1131AcD079506',
      abi: vesenAbi,
    }, //ERC20Mock VESEN
    SVESEN: {
      address: '0x57A68cA7286FcB8b79e8f0F89d7aB0CBf982f7EB',
      abi: erc20ABI,
    },
    SENUSD: {
      address: '0xd0D421Fa19fde0bfD1f54a7E17b625d47332f216',
      abi: erc20ABI,
    },
    FAUCET: {
      address: '0x27D2a83a4E813AB587CDeE9c5cd0944183595359',
      abi: faucetAbi,
    },
    SENREWARDS: {
      address: '0x7997cB4f977D7dd6b50a23C09C94CF25eABD169a',
      abi: rewardsDistributor,
    },
    SSEN: {
      address: '0xa01bb5eee4701914407ccb3d4c0168630e35ca2e',
      abi: sSen,
    },
    MARKET: {
      address: '0xA11A594FF4495590B15CC282f7517082Ec18eAF9',
      abi: market,
    },
    SENBOX: {
      address: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
      abi: IbentoBox2,
    },
  },
};
