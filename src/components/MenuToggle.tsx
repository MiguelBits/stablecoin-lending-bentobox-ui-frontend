import React from 'react';
import { Box, Icon, IconButton } from '@chakra-ui/react';
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi';

interface MenuToggleProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}
const MenuToggle: React.FC<MenuToggleProps> = ({ onClose, onOpen, isOpen }) => {
  return (
    <Box display={['block', 'none']} onClick={isOpen ? onClose : onOpen}>
      <IconButton
        size={'md'}
        variant="ghost"
        icon={
          <Icon
            as={isOpen ? HiX : HiOutlineMenuAlt3}
            fontSize="2xl"
            mt="1"
            color="white"
          />
        }
        aria-label={'Open Menu'}
        display={{ md: 'none' }}
        onClick={isOpen ? onClose : onOpen}
      />
    </Box>
  );
};

export default MenuToggle;
