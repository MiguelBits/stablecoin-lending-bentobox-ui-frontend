import {
  AspectRatio,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { BiChevronDown } from 'react-icons/bi';

import useToken from 'hooks/useToken';

import { useContractContext } from 'contexts/contractContext';

import useConnectToast from '@/hooks/useConnectToast';

const CustomConnectButton = () => {
  const { contracts } = useContractContext();
  const token = useToken(contracts.USDT.address);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useConnectToast(account);

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    px="0"
                    background="transparent"
                    transition="all 0.3s ease"
                    _hover={{
                      textShadow: '0px 0px 20px #E8B96A',
                    }}
                    _active={{
                      textShadow: '0px 0px 20px #E8B96A',
                    }}
                    _focus={{
                      textShadow: '0px 0px 20px #E8B96A',
                    }}
                    color="brand.secondary"
                    onClick={openConnectModal}
                    fontSize={['md', 'md', 'md', 'md', '1.003vw']}
                  >
                    Connect Wallet
                  </Button>
                );
              }

              return (
                <Flex gap={4}>
                  <Button
                    onClick={openChainModal}
                    display="flex"
                    alignItems="center"
                    variant="unstyled"
                    px="0"
                    background="transparent"
                    transition="all 0.3s ease"
                    _hover={{
                      color: 'white',
                    }}
                    _active={{
                      color: 'white',
                    }}
                    _focus={{
                      color: 'white',
                    }}
                    color="whiteAlpha.600"
                    rightIcon={
                      <Icon
                        as={BiChevronDown}
                        fontSize={[
                          '1.2rem',
                          '1.2rem',
                          '1.2rem',
                          '1.2rem',
                          '1.203vw',
                        ]}
                      />
                    }
                  >
                    <Box>
                      {chain.hasIcon && chain.iconUrl && (
                        <AspectRatio
                          ratio={1 / 1}
                          w={[5, 5, '1.253vw']}
                          h={[5, 5, 5, 5, '1.253vw']}
                          bg={chain.iconBackground}
                          borderRadius="full"
                          overflow="hidden"
                          mr={[2, 2, '0.501vw']}
                        >
                          <Image
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            fill
                          />
                        </AspectRatio>
                      )}
                    </Box>
                    <Text fontSize={['md', 'md', 'md', 'md', '1.003vw']}>
                      {chain.name}
                    </Text>
                  </Button>
                  {/* <Center height={[5, 5, '1.253vw']} alignSelf="center">
                    <Divider orientation="vertical" />
                  </Center> */}
                  <Text
                    minW="fit-content"
                    alignSelf="center"
                    color="whiteAlpha.600"
                    fontWeight="bold"
                    fontSize={['md', 'md', '1.003vw']}
                    transition="all 0.3s ease"
                  >
                    <>
                      {/* {token.balance.toLocaleString()} {token.tokenSymbol} */}
                    </>
                  </Text>
                  {/* <Center height={[5, 5, '1.253vw']} alignSelf="center">
                    <Divider orientation="vertical" />
                  </Center> */}
                  <Button
                    pl={[3, 3, '0.752vw']}
                    background="transparent"
                    transition="all 0.3s ease"
                    _hover={{
                      color: 'white',
                    }}
                    _active={{
                      color: 'white',
                    }}
                    _focus={{
                      color: 'white',
                    }}
                    color="brand.secondary"
                    onClick={openAccountModal}
                    fontSize={['md', 'md', 'md', 'md', '1.003vw']}
                    rightIcon={
                      <Icon
                        as={BiChevronDown}
                        fontSize={[
                          '1.2rem',
                          '1.2rem',
                          '1.2rem',
                          '1.2rem',
                          '1.203vw',
                        ]}
                      />
                    }
                  >
                    {account.displayName}
                  </Button>
                </Flex>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
