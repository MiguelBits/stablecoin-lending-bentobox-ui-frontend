import { AspectRatio, AspectRatioProps, Link } from '@chakra-ui/react';
import Image from 'next/image';

export const LongLogo: React.FC<AspectRatioProps> = ({ ...props }) => {
  return (
    <Link href="/">
      <AspectRatio ratio={2000 / 469} {...props}>
        <Image src="/logos/logo-standard.png" alt="Seneca" fill />
      </AspectRatio>
    </Link>
  );
};
