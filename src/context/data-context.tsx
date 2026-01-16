'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockData as initialMockData } from '@/lib/mock-data';
import type { MockData } from '@/lib/types';

interface DataContextType {
  data: MockData;
  setData: React.Dispatch<React.SetStateAction<MockData>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<MockData>(initialMockData);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
