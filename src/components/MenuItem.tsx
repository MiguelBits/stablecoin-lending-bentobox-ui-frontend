import { Link } from '@chakra-ui/react';

import { NavLink as INavLink } from 'models/links';

export interface MenuItemProps extends INavLink {
  isActive: boolean;
}
const MenuItem: React.FC<MenuItemProps> = ({ label, link, isActive }) => {
  return (
    <Link
      px={[2, 2, '0.501vw']}
      py={[1, 1, '0.251vw']}
      rounded={'md'}
      cursor="pointer"
      fontSize={['md', 'md', 'md', 'md', '1.003vw']}
      color={isActive ? 'white' : 'whiteAlpha.600'}
      fontWeight="bold"
      textShadow={isActive ? '0px 0px 20px #E8B96A' : 'none'}
      _hover={{
        textDecoration: 'none',
        color: 'brand.secondary',
      }}
      href={link}
    >
      {label}
    </Link>
  );
};

export default MenuItem;
