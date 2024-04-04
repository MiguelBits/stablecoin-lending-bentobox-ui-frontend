export const formatWalletAddress = (
  address: string | undefined | null,
  firstBreakpoint = 6,
  secondBreakpoint = 5
): string => {
  if (!address) {
    return '';
  }

  if (address.length > 35) {
    return `${address.slice(0, firstBreakpoint)}...${address.slice(
      address.length - secondBreakpoint,
      address.length
    )}`;
  }

  return address;
};
