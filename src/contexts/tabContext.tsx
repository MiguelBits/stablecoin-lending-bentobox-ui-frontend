import React, { createContext, useContext, ReactNode, useState } from 'react';

interface TabContextProps {
  selectedTab: number;
  setSelectedTab: (tab: number) => void;
}

export const TabContext = createContext<TabContextProps | undefined>(undefined);

export const TabProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <TabContext.Provider value={{ selectedTab, setSelectedTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTab = () => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTab must be used within a TabProvider');
  }
  return context;
};
