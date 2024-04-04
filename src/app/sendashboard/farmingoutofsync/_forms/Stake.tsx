'use client';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import InfoStat from 'components/InfoStat';

import TokenLogo from 'assets/logos/token-logo.svg';
import SushiLogo from 'assets/logos/sushi-logo.svg';

const Stake = () => {
  return (
    <Stack spacing={6}>
      <FormControl>
        <FormLabel
          color="text.secondary"
          fontSize="sm"
          display="flex"
          justifyContent="space-between"
        >
          <Text>Farming Opportunities</Text>
          <Text>0</Text>
        </FormLabel>
        <Box
          border="1px solid rgba(232, 185, 106, 0.12)"
          py="1"
          px="2"
          borderRadius="md"
        >
          <Menu>
            <MenuButton w="full" as={Button} rightIcon={<ChevronDownIcon />}>
              <HStack>
                <Icon as={SushiLogo} />
                <Text fontSize="sm" fontWeight="400">
                  xSUSHI
                </Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem>xSUSHI</MenuItem>
              <MenuItem>xSUSHI</MenuItem>
              <MenuItem>xSUSHI</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </FormControl>

      <InputGroup>
        <InputLeftElement width={[28, 28, '7.018vw']}>
          <HStack spacing={[2, 2, '0.501vw']}>
            <Icon as={TokenLogo} w={[6, 6, '1.504vw']} h={[6, 6, '1.504vw']} />
            <Text fontSize={['md', 'md', '1.003vw']} color="text.secondary">
              Seneca
            </Text>
          </HStack>
        </InputLeftElement>
        <Input
          pl={[32, 32, '8.020vw']}
          placeholder="0"
          // {...register('tokenAmount')}
          color="text.secondary"
        />
      </InputGroup>

      <HStack mt={4}>
        <Button variant="brandYellowFill" w="full">
          APPROVE
        </Button>
      </HStack>

      <Stack>
        <InfoStat
          tooltipLabel="Annual Return on Staked tokens at current price"
          label="APR:"
          value="0.0%"
        />
        <InfoStat
          tooltipLabel="Total Value Locked in the Farm"
          label="LTV:"
          value="$ 243.1575"
        />
      </Stack>
    </Stack>
  );
};

export default Stake;
