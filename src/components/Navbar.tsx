import { Flex, HStack, Icon, useDisclosure } from '@chakra-ui/react';

import NavBarContainer from 'components/NavbarContainer';
import MenuItem from 'components/MenuItem';
import MenuLinks from 'components/MenuLinks';
import MenuToggle from 'components/MenuToggle';
import MenuDashboardLinks from 'components/MenuDashboardLinks';

import TokenLogo from 'assets/logos/token-logo.svg';

interface NavbarProps {
  isDashboard?: boolean;
}
const Navbar: React.FC<NavbarProps> = ({ isDashboard = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <NavBarContainer>
      <Flex
        p={[2, 2, '0.501vw']}
        alignItems={'center'}
        justifyContent={'space-between'}
        position="relative"
        w="full"
      >
        <HStack flex="1" spacing={[2, 2, '0.501vw']}>
          <Icon
            as={TokenLogo}
            w={[8, 8, '2.005vw']}
            h={[8, 8, '2.005vw']}
            mr={[2, 2, '0.501vw']}
          />
          {/* <MenuItem
            isActive={isDashboard ? false : true}
            isHidden={true}
            link="/#"
            label="Seneca"
          /> */}
        </HStack>
        <MenuToggle isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      </Flex>
      {isDashboard ? (
        <MenuDashboardLinks onClose={onClose} isOpen={isOpen} />
      ) : (
        <MenuLinks onClose={onClose} isOpen={isOpen} />
      )}
    </NavBarContainer>
  );
};

export default Navbar;
