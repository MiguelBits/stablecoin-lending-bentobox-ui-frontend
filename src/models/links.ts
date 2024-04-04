import { As } from '@chakra-ui/react';

export interface NavLink {
  label: string;
  link: string;
  isHidden: boolean;
}

export interface FooterLink {
  label: string;
  link: string;
  isExternal: boolean;
  icon: As;
}
