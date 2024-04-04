import {
  Flex,
  Icon,
  Stack,
  Text,
  AccordionButton,
  Table,
  Tr,
  Td,
  Tbody,
} from '@chakra-ui/react';

import PlaceholderIcon from 'assets/icons/placeholder.svg';
import EthereumWhiteLogo from 'assets/logos/ethereum-white.svg';

const TableItem = () => {
  return (
    <AccordionButton px={0}>
      <Table>
        <Tbody>
          <Tr w="full" mb="0 !important" pb="0 !important">
            <Td display={['block', 'table-cell']} width={['100%', '40%']}>
              <Flex alignItems="center" justifyContent={['space-between']}>
                <Stack spacing={[2, 2, '0.501vw']}>
                  <Flex gap={2}>
                    <Flex>
                      <Icon
                        as={PlaceholderIcon}
                        fontSize={['lg', '2xl', '1.504vw']}
                      />
                      <Icon
                        as={EthereumWhiteLogo}
                        ml="-1"
                        fontSize={['lg', '2xl', '1.504vw']}
                      />
                    </Flex>
                    <Text
                      color="brand.secondary"
                      fontSize={['0.625rem', '0.625rem', '0.627vw']}
                    >
                      1%
                    </Text>
                  </Flex>

                  <Text
                    color="white"
                    fontSize={['md', 'md', '1.003vw']}
                    fontWeight="500"
                    lineHeight={['shorter', 'shorter', '1.253vw']}
                  >
                    BSN/WETH
                  </Text>
                </Stack>

                <Stack spacing={[2, 2, '0.501vw']}>
                  <Flex alignItems="center" gap={[2.5, 2.5, '0.627vw']}>
                    <Text
                      color="text.secondary"
                      fontSize={['sm', 'sm', '0.877vw']}
                    >
                      Min
                    </Text>
                    <Text
                      color="white"
                      fontSize={['sm', 'sm', '0.877vw']}
                      lineHeight={['0.875rem', '0.875rem', '0.877vw']}
                    >
                      0.0000 WETH per BSN
                    </Text>
                  </Flex>
                  <Flex alignItems="center" gap={[2.5, 2.5, '0.627vw']}>
                    <Text
                      color="text.secondary"
                      fontSize={['sm', 'sm', '0.877vw']}
                    >
                      Max
                    </Text>
                    <Text
                      color="white"
                      fontSize={['sm', 'sm', '0.877vw']}
                      lineHeight={['0.875rem', '0.875rem', '0.877vw']}
                    >
                      0.0000 WETH per BSN
                    </Text>
                  </Flex>
                </Stack>
              </Flex>
            </Td>
            <Td display={['block', 'table-cell']} width={['100%', '20%']}>
              <Text
                color="white"
                fontSize={['sm', 'sm', '0.877vw']}
                lineHeight={['0.875rem', '0.875rem', '0.877vw']}
              >
                0.00%
              </Text>
            </Td>
            <Td display={['block', 'table-cell']} width={['100%', '20%']}>
              <Stack spacing={[2, 2, '0.501vw']}>
                <Flex alignItems="center" gap={[2.5, 2.5, '0.627vw']}>
                  <Text
                    color="text.secondary"
                    fontSize={['sm', 'sm', '0.877vw']}
                  >
                    Curr.
                  </Text>
                  <Text
                    color="white"
                    fontSize={['sm', 'sm', '0.877vw']}
                    lineHeight={['0.875rem', '0.875rem', '0.877vw']}
                  >
                    0.00% &#8594; 0.00%
                  </Text>
                </Flex>
                <Flex alignItems="center" gap={[2.5, 2.5, '0.627vw']}>
                  <Text
                    color="text.secondary"
                    fontSize={['sm', 'sm', '0.877vw']}
                  >
                    Proj.
                  </Text>
                  <Text
                    color="white"
                    fontSize={['sm', 'sm', '0.877vw']}
                    lineHeight={['0.875rem', '0.875rem', '0.877vw']}
                  >
                    26.96% &#8594; 134.81%
                  </Text>
                </Flex>
              </Stack>
            </Td>
            <Td display={['block', 'table-cell']} width={['100%', '15%']}>
              <Text
                color="white"
                fontSize={['sm', 'sm', '0.877vw']}
                lineHeight={['0.875rem', '0.875rem', '0.877vw']}
              >
                -
              </Text>
            </Td>
            <Td display={['block', 'table-cell']} width={['100%', '13%']}>
              <Text
                color="white"
                fontSize={['sm', 'sm', '0.877vw']}
                lineHeight={['0.875rem', '0.875rem', '0.877vw']}
              >
                $28.14k
              </Text>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </AccordionButton>
  );
};

export default TableItem;
