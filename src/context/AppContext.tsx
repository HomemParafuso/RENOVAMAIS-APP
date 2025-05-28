import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext<any>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [faturas, setFaturas] = useState<any[]>([]);

  const addFatura = (fatura: any) => {
    setFaturas((prevFaturas) => [...prevFaturas, fatura]);
  };

  return (
    <AppContext.Provider value={{ faturas, addFatura }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext); 