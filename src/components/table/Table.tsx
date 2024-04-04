import { Table as ChakraTable, TableProps } from '@chakra-ui/react';

import { Provider as TableProvider } from 'contexts/tableContext';

export const Table = (props: TableProps) => {
  const { className, ...rest } = props;
  const classes = `${className || ''} responsiveTable`;

  return (
    <TableProvider value={{}}>
      <ChakraTable {...rest} className={classes} />
    </TableProvider>
  );
};
