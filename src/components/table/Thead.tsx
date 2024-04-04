import { TableHeadProps, Thead as ChakraThead } from '@chakra-ui/react';
import { cloneElement, isValidElement } from 'react';

export const Thead = (props: TableHeadProps) => {
  const { children, ...rest } = props;
  const childrenFromArray = (children as React.ReactNode[])[0];
  return (
    <ChakraThead {...rest}>
      {isValidElement(childrenFromArray) &&
        // eslint-disable-next-line
        // @ts-ignore
        cloneElement(childrenFromArray, { inHeader: true })}
    </ChakraThead>
  );
};
