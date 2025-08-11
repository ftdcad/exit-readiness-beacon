
import React, { createContext, useContext, ReactNode } from 'react';
import { useProgress } from '@/hooks/useProgress';

const ProgressContext = createContext<ReturnType<typeof useProgress> | undefined>(undefined);

export const useProgressContext = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgressContext must be used within a ProgressProvider');
  }
  return context;
};

interface ProgressProviderProps {
  children: ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const progress = useProgress();
  
  return (
    <ProgressContext.Provider value={progress}>
      {children}
    </ProgressContext.Provider>
  );
};
