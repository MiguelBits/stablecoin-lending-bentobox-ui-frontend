import { Box, Icon, IconButton, Link, Stack } from '@chakra-ui/react';

import { LongLogo } from 'components/Logo';

import { FooterLink } from 'models/links';

import { footerLinks } from 'constants/links';

const Footer = () => {
  return (
    <Box
      borderTop="1px solid"
      borderColor="background.secondary"
      w="full"
      as="footer"
    >
      <Stack
        py={[4, 4, '1.003vw']}
        mx={[6, 6, '1.504vw']}
        direction={['column', 'row']}
        spacing={[4, 4, '1.003vw']}
        justify={['center', 'space-between']}
        align="center"
      >
        <LongLogo
          w={['4.313rem', '4.313rem', '4.313rem', '4.323vw', '4.323vw']}
        />
        <Stack direction="row" spacing={[2, 2, '0.501vw']}>
          {footerLinks.map((footerLink: FooterLink, index: number) => {
            return (
              <Link
                key={index}
                href={footerLink.link}
                isExternal={footerLink.isExternal}
              >
                <IconButton
                  variant="ghost"
                  aria-label={footerLink.label}
                  fontSize={
                    footerLink.label === 'Seneca Mirror'
                      ? ['lg', 'lg', 'lg', 'lg', '1.128vw']
                      : ['xl', 'xl', 'xl', 'xl', '1.253vw']
                  }
                  icon={<Icon as={footerLink.icon} />}
                />
              </Link>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Footer;
