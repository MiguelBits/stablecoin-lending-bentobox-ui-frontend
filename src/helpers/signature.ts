import { useAccount, useChainId, useSignMessage } from 'wagmi';
import { recoverMessageAddress } from 'viem';

const signMasterContract = async (
  account: any, // Replace with your signer type
  chainId: number,
  verifyingContract: string,
  user: string,
  masterContract: string,
  approved: boolean,
  nonce: number
) => {
  try {
    const chainHex = chainId;

    const domain = {
      name: 'BentoBox V1',
      chainId: chainHex,
      verifyingContract,
    };

    // The named list of all type definitions
    const types = {
      SetMasterContractApproval: [
        { name: 'warning', type: 'string' },
        { name: 'user', type: 'address' },
        { name: 'masterContract', type: 'address' },
        { name: 'approved', type: 'bool' },
        { name: 'nonce', type: 'uint256' },
      ],
    };

    const warning = approved
      ? 'Give FULL access to funds in (and approved to) BentoBox?'
      : 'Revoke access to BentoBox?';

    // The data to sign
    const value = {
      warning,
      user,
      masterContract,
      approved,
      nonce,
    };

    const signature = await account._signTypedData(domain, types, value);

    const parsedSignature = parseSignature(signature);

    if (parsedSignature.v === 0) {
      parsedSignature.v = 27;
    }

    if (parsedSignature.v === 1) {
      parsedSignature.v = 28;
    }

    return parsedSignature;
  } catch (error) {
    console.log('signMasterContract error:', error);
    return false;
  }
};

const parseSignature = (signature: string) => {
  // Your custom signature format
  const r = '0x' + signature.substring(0, 64);
  const s = '0x' + signature.substring(64, 128);
  const v = parseInt('0x' + signature.substring(128, 130), 16);

  return {
    r,
    s,
    v,
  };
};

export { parseSignature, signMasterContract };
