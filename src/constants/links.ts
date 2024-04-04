import { FooterLink, NavLink } from 'models/links';

import TwitterIcon from 'assets/icons/twitter.svg';
import DiscordIcon from 'assets/icons/discord.svg';
import TelegramIcon from 'assets/icons/telegram.svg';
import BookmarkIcon from 'assets/icons/bookmark.svg';
import GitbookIcon from 'assets/icons/gitbook.svg';

export const externalLinks = {
  SENECA_TWITTER: 'https://twitter.com/SenecaUSD',
  SENECA_DISCORD: 'https://discord.com/invite/senecaprotocol',
  SENECA_TELEGRAM: 'https://t.me/seneca_protocol',
  SENECA_MIRROR:
    'https://mirror.xyz/0x289D0033d536eb3Ff53367f0A8CceA00d4Ac63a0',
  SENECA_GITBOOK:
    'https://seneca-protocol-docs.gitbook.io/seneca-protocol/overview/seneca-protocol',
};

export const internalLinks = {
  CHAMBERS: '/sendashboard/chambers',
  BORROW: '/sendashboard/borrow',
  LEVERAGE: '/sendashboard/leverage',
  POSITIONS: '/sendashboard/positions',
  STAKING: '/sendashboard/staking',
  VESEN: '/sendashboard/vesen',
  SENSTAKING: '/sendashboard/senstaking',
  CLAIM: '/sendashboard/claim',
  FARMING: '/sendashboard/farming',
  JOIN_FARMING: '/sendashboard/farming/join',
};

export const navDashboardLinks: NavLink[] = [
  {
    label: 'Chambers',
    link: internalLinks.CHAMBERS,
    isHidden: false,
  },
  {
    label: 'Borrow',
    link: internalLinks.BORROW,
    isHidden: false,
  },
  {
    label: 'Positions',
    link: internalLinks.POSITIONS,
    isHidden: false,
  },
  {
    label: 'Leverage',
    link: internalLinks.LEVERAGE,
    isHidden: false,
  },
  {
    label: 'veSEN',
    link: internalLinks.VESEN,
    isHidden: true,
  },
  {
    label: 'Staking',
    link: internalLinks.SENSTAKING,
    isHidden: false,
  },
  {
    label: 'Claim',
    link: internalLinks.CLAIM,
    isHidden: false,
  },
  {
    label: 'Farming',
    link: internalLinks.FARMING,
    isHidden: true,
  },
];
export const navLinks: NavLink[] = [
  {
    label: 'Chambers',
    link: 'sendashboard/chambers',
    isHidden: false,
  },
  {
    label: 'Borrow',
    link: 'sendashboard/borrow',
    isHidden: false,
  },
  {
    label: 'Positions',
    link: 'sendashboard/positions',
    isHidden: false,
  },
  {
    label: 'Leverage',
    link: 'sendashboard/leverage',
    isHidden: false,
  },
  {
    label: 'veSEN',
    link: 'sendashboard/vesen',
    isHidden: false,
  },
  {
    label: 'Staking',
    link: 'sendashboard/senstaking',
    isHidden: false,
  },
  {
    label: 'Farming',
    link: 'sendashboard/farming',
    isHidden: true,
  },
];

export const footerLinks: FooterLink[] = [
  {
    label: 'Seneca Twitter',
    link: externalLinks.SENECA_TWITTER,
    isExternal: true,
    icon: TwitterIcon,
  },
  {
    label: 'Seneca Discord',
    link: externalLinks.SENECA_DISCORD,
    isExternal: true,
    icon: DiscordIcon,
  },
  {
    label: 'Seneca Telegram',
    link: externalLinks.SENECA_TELEGRAM,
    isExternal: true,
    icon: TelegramIcon,
  },
  {
    label: 'Seneca Mirror',
    link: externalLinks.SENECA_MIRROR,
    isExternal: true,
    icon: BookmarkIcon,
  },
  {
    label: 'Seneca Gitbook',
    link: externalLinks.SENECA_GITBOOK,
    isExternal: true,
    icon: GitbookIcon,
  },
];
