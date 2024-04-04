import {
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  Box,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';

interface DebouncedInputProps extends InputProps {
  debounce?: number;
  onChange: (value: any) => void;
}
const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value: initialValue,
  onChange,
  debounce = 300,
  ...inputProps
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange?.(value);
    }, debounce);

    return () => {
      return clearTimeout(timeout);
    };
  }, [value]);

  return (
    <InputGroup>
      <InputLeftElement>
        <Icon
          as={BiSearch}
          color="text.secondary"
          fontSize={['md', 'md', 'md']}
        />
      </InputLeftElement>
      <Input
        type="text"
        {...inputProps}
        value={value}
        onChange={(e) => {
          return setValue(e.target.value);
        }}
        fontSize={['md', 'md', 'md']}
        _placeholder={{
          color: 'text.white',
        }}
      />
    </InputGroup>
  );
};

export default DebouncedInput;
