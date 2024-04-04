import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  HStack,
  Hide,
  Icon,
  Show,
  Stack,
} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

import MenuItem from 'components/MenuItem';
import CustomConnectButton from 'components/CustomConnectButton';

import { navDashboardLinks } from 'constants/links';

import TokenLogo from 'assets/logos/token-logo.svg';

interface MenuDashboardLinksProps {
  isOpen: boolean;
  onClose: () => void;
}
const MenuDashboardLinks: React.FC<MenuDashboardLinksProps> = ({
  isOpen,
  onClose,
}) => {
  const pathname = usePathname();
  return (
    <>
      {/* Desktop */}
      <Show above="sm">
        <Box flexBasis={['100%', '100%', '100%']} w="full">
          <Stack
            spacing={[6, 6, '1.504vw']}
            align="center"
            h="full"
            justify={'flex-end'}
            direction={['column', 'row']}
            fontSize={'lg'}
          >
            {navDashboardLinks.map((navLink, index: number) => {
              const isActive = pathname?.startsWith(navLink.link) || false;
              if (navLink.isHidden) {
                return null;
              }
              return <MenuItem isActive={isActive} {...navLink} key={index} />;
            })}
            <CustomConnectButton />
          </Stack>
        </Box>
      </Show>
      {/* Mobile */}
      <Hide above="sm">
        <Drawer onClose={onClose} isOpen={isOpen} size="full">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody>
              <HStack>
                <Icon as={TokenLogo} w="8" h="8" mr={2} />
                {/* <MenuItem
                  isActive={true}
                  isHidden={true}
                  link="/#"
                  label="Seneca"
                /> */}
              </HStack>
              <Stack
                mt={8}
                spacing={8}
                justify={'flex-end'}
                direction={['column', 'row', 'row', 'row']}
              >
                <Box>
                  <CustomConnectButton />
                </Box>
                {navDashboardLinks.map((navLink, index: number) => {
                  const isActive = pathname?.startsWith(navLink.link) || false;
                  if (navLink.isHidden) {
                    return null;
                  }
                  return (
                    <MenuItem isActive={isActive} {...navLink} key={index} />
                  );
                })}
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Hide>
    </>
  );
};

export default MenuDashboardLinks;
