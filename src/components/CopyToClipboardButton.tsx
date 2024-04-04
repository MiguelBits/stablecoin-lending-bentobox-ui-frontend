import { Box, HStack, Icon, Tooltip, useClipboard } from '@chakra-ui/react';
import { BiCopy } from 'react-icons/bi';

const CLOSE_DELAY = 800;

interface CopyToClipboardButtonProps {
  textToBeCopied: string;
}
const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  textToBeCopied,
}) => {
  const { onCopy, hasCopied } = useClipboard(textToBeCopied);

  return (
    <HStack align="center">
      <Tooltip label={hasCopied ? 'Copied!' : 'Copy'} closeDelay={CLOSE_DELAY}>
        <Box onClick={onCopy}>
          <Icon
            fontSize={['md', 'md', '1.003vw']}
            as={BiCopy}
            color="brand.secondary"
            cursor="pointer"
            _hover={{ color: 'brand.yellow.100' }}
          />
        </Box>
      </Tooltip>
    </HStack>
  );
};

export default CopyToClipboardButton;
