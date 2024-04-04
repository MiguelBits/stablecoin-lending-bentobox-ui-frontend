import { useState } from 'react';

export const useToggle = (initialValue = false) => {
  const [isWithdraw, setIsWithdraw] = useState(initialValue);

  const toggle = () => {
    setIsWithdraw((prevIsWithdraw) => {
      return !prevIsWithdraw;
    });
  };

  return { isWithdraw, toggle };
};
