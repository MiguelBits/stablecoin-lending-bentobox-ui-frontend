'use client';
import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  Table,
  Tr,
  Thead,
  Th,
} from '@chakra-ui/react';

import Statistics from 'components/Statistics';

import FormTabs from 'app/sendashboard/stakingoutofsync/_components/FormTabs';
import TableItem from 'app/sendashboard/stakingoutofsync/_components/TableItem';

const Staking = () => {
  return (
    <Box>
      <Center mb={[0, 4, '1.003vw']}>
        <Heading
          fontSize={['4xl', '5xl', '3.008vw']}
          letterSpacing={['-0.52px', '-0.52px', '-0.033vw']}
          textAlign="center"
          fontWeight="400"
        >
          <Text as="span" color="white" pr={[1, 1, '0.251vw']}>
            STAKE{' '}
          </Text>
          <Text as="span" fontStyle="italic" color="brand.secondary">
            SENECA
          </Text>
        </Heading>
      </Center>
      <Center>
        <Grid
          templateColumns={['1fr', '1fr', '1fr 1fr 1fr']}
          gap={[4, 4, '4.010vw']}
        >
          <GridItem display="flex" alignItems="center">
            <Statistics label="TVL" value="$19.84M" />
          </GridItem>
          <GridItem display="flex" alignItems="center">
            <Statistics label="24h Volume" value="$203.95k" />
          </GridItem>
          <GridItem display="flex" alignItems="center">
            <Statistics label="24h Fees" value="$257.06" />
          </GridItem>
        </Grid>
      </Center>
      <Box overflowX="auto">
        <Table mt={4} size="sm">
          <Thead>
            <Tr>
              <Th w={['40%', '40%', '40%', '40%']}>Pool & Range</Th>
              <Th w={['15%', '15%', '15%', '15%']}>swapAPR</Th>
              <Th w={['20%', '20%', '20%', '20%']}>vAPR</Th>
              <Th w={['13%', '13%', '13%', '13%']}>My Deposits</Th>
              <Th w={['12%', '12%', '12%', '12%']}>TVL</Th>
            </Tr>
          </Thead>
        </Table>
      </Box>
      <Box
        pos="relative"
        _before={{
          content: '""',
          position: 'absolute',
          bottom: 0,
          width: 'full',
          height: ['100px', '100px', '6.266vw'],
          bgGradient:
            'linear(to-t, background.primary, background.primary 50%,transparent)',
          zIndex: 2,
        }}
      >
        <Accordion
          allowToggle
          border="1px solid transparent"
          mt={-1}
          overflow="auto"
          h="70vh"
          pr={2}
          pos="relative"
          sx={{
            '&::-webkit-scrollbar': {
              height: [1.5, 1.5, '0.376vw'],
              width: [1.5, 1.5, '0.376vw'],
            },
            '&::-webkit-scrollbar-track': {
              background: 'dash.tooltip',
              width: [1.5, 1.5, '0.376vw'],
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'background.tertiary',
              borderRadius: '24px',
            },
          }}
        >
          <AccordionItem>
            <TableItem />
            <FormTabs />
          </AccordionItem>
          <AccordionItem>
            <TableItem />
            <FormTabs />
          </AccordionItem>
          <AccordionItem>
            <TableItem />
            <FormTabs />
          </AccordionItem>
          <AccordionItem>
            <TableItem />
            <FormTabs />
          </AccordionItem>
          <AccordionItem>
            <TableItem />
            <FormTabs />
          </AccordionItem>
          <AccordionItem>
            <TableItem />
            <FormTabs />
          </AccordionItem>
        </Accordion>
      </Box>
    </Box>
  );
};

export default Staking;
