import React, { createContext, useContext, ReactNode, useState } from 'react';

interface ColorContextType {
  ltvColor: string;
  setLtvColor: React.Dispatch<React.SetStateAction<string>>;
  collateralColor: string;
  setCollateralColor: React.Dispatch<React.SetStateAction<string>>;
  liqPriceColor: string;
  setLiqPriceColor: React.Dispatch<React.SetStateAction<string>>;
  ltvResult: number;
  setLtvResult: React.Dispatch<React.SetStateAction<number>>;
}

export const ColorContext = createContext<ColorContextType | undefined>(
  undefined
);

export const useColorContext = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColorContext must be used within a ColorProvider');
  }
  return context;
};

interface ColorProviderProps {
  children: ReactNode;
}

export const ColorProvider: React.FC<ColorProviderProps> = ({ children }) => {
  const [ltvColor, setLtvColor] = useState<string>('');
  const [collateralColor, setCollateralColor] = useState<string>('');
  const [liqPriceColor, setLiqPriceColor] = useState<string>('');
  const [ltvResult, setLtvResult] = useState<number>(0);

  const contextValue: ColorContextType = {
    ltvColor,
    setLtvColor,
    collateralColor,
    setCollateralColor,
    liqPriceColor,
    setLiqPriceColor,
    ltvResult,
    setLtvResult,
  };

  return (
    <ColorContext.Provider value={contextValue}>
      {children}
    </ColorContext.Provider>
  );
};
