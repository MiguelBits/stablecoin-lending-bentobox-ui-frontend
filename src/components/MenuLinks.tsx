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

import { navLinks } from 'constants/links';

import TokenLogo from 'assets/logos/token-logo.svg';

interface MenuLinksProps {
  isOpen: boolean;
  onClose: () => void;
}
const MenuLinks: React.FC<MenuLinksProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  return (
    <>
      {/* Desktop */}
      <Show above="sm">
        <Box flexBasis={['100%', '100%', 'auto']} w="full">
          <Stack
            spacing={[8, 8, '2.005vw']}
            align="center"
            h="full"
            justify="flex-end"
            direction={['column', 'row']}
          >
            {navLinks.map((navLink, index: number) => {
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
                {navLinks.map((navLink, index: number) => {
                  const isActive = pathname?.startsWith(navLink.link) || false;
                  if (navLink.isHidden) {
                    return null;
                  }
                  return (
                    <MenuItem isActive={isActive} {...navLink} key={index} />
                  );
                })}
                <Box>
                  <CustomConnectButton />
                </Box>
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Hide>
    </>
  );
};

export default MenuLinks;
