import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
} from '@chakra-ui/react';
import icons from 'base64-cryptocurrency-icons';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { formatWalletAddress } from 'lib/utils/formatWalletAddress';

import { useBorrowContext } from 'contexts/borrowContext';

const CollateralAssetsMenu: React.FC<MenuButtonProps> = ({
  ...menuButtonProps
}) => {
  const {
    collateralTokens,
    activeCollateralToken,
    updateActiveCollateralToken,
  } = useBorrowContext();
  const [token, setToken] = useState<string | null>(null);

  const onCollateralAssetChange = (value: string | string[]) => {
    const foundCollateral = collateralTokens?.find((collateralToken) => {
      return collateralToken.address === value;
    });
    if (foundCollateral) {
      updateActiveCollateralToken(foundCollateral);
    }
  };
  console.log(BigInt(1000 * 1e18));
  const searchParams = useSearchParams();

  useEffect(() => {
    setToken(searchParams?.get('token') || null);
    if (token) {
      onCollateralAssetChange(token);
    }
  }, [token]);

  const activeCollateralTokenIcon = useMemo(() => {
    if (activeCollateralToken?.symbol?.toLowerCase() === 'weth') {
      return {
        name: 'WETH',
        icon: '/images/collateralTokens/weth.png',
      };
    } else if (activeCollateralToken?.symbol?.toLowerCase() === 'rusdc') {
      return {
        name: 'RUSDC',
        icon: '/images/collateralTokens/rusdc.png',
      };
    }
    if (activeCollateralToken?.symbol) {
      return icons[activeCollateralToken?.symbol];
    }
    return icons['SEN'];
  }, [activeCollateralToken]);

  return (
    <Menu>
      <MenuButton
        backgroundColor={['rgba(232, 185, 106, 0.12)']}
        w={['13.25rem', '12.25rem', '15.278vw', '15.278vw', '11.278vw']}
        h={['2rem', '2rem', '2rem', '3rem']}
        as={Button}
        rightIcon={
          <HStack
            color="white"
            paddingLeft={['0', '0', '0', '0', '0']}
            marginRight={['0', '0', '0', '0', '0']}
          >
            <ChevronDownIcon marginLeft={['0', '0', '0', '4', '0']} />
          </HStack>
        }
        {...menuButtonProps}
        _hover={{ backgroundColor: 'rgba(232, 185, 106, 0.2)' }}
      >
        <HStack spacing={[2, 2, 2, '0.501vw']} justifyContent={'center'}>
          {activeCollateralTokenIcon && (
            <Image
              src={activeCollateralTokenIcon?.icon}
              alt={activeCollateralToken?.symbol}
              w={[6, 6, 6]}
              h={[6, 6, 6]}
            />
          )}
          <Text
            fontSize={['sm', 'md', 'sm', 'md']}
            fontWeight="400"
            color="text.secondary"
          >
            {activeCollateralToken?.symbol || ''}
          </Text>
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          defaultValue={activeCollateralToken?.address}
          title="Collateral Assets"
          type="radio"
          onChange={(value) => {
            onCollateralAssetChange(value);
          }}
        >
          {collateralTokens?.map((collateralToken, index: number) => {
            const collateralTokenIcon =
              collateralToken?.symbol?.toLowerCase() === 'weth'
                ? {
                    name: 'WETH',
                    icon: '/images/collateralTokens/weth.png',
                  }
                : collateralToken?.symbol?.toLowerCase() === 'rusdc'
                ? {
                    name: 'RUSDC',
                    icon: '/images/collateralTokens/rusdc.png',
                  }
                : icons[collateralToken?.symbol];

            return (
              <MenuItemOption key={index} value={collateralToken.address}>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  gap={4}
                  fontSize={['sm', 'md', 'sm', 'md']}
                >
                  <HStack>
                    {collateralTokenIcon && (
                      <Image
                        src={collateralTokenIcon?.icon}
                        alt={collateralToken.symbol}
                        w="4"
                        h="4"
                      />
                    )}
                    <Text>{collateralToken.symbol}</Text>
                  </HStack>
                  <Text color="text.secondary">
                    {formatWalletAddress(collateralToken.address)}
                  </Text>
                </Flex>
              </MenuItemOption>
            );
          })}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default CollateralAssetsMenu;
