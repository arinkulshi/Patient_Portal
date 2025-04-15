// src/context/ReportContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ReportFilterParams } from '../types';

// Define the context state structure
interface ReportContextState {
  filters: ReportFilterParams;
  updateFilters: (filters: ReportFilterParams) => void;
}

// Create the context with default values
const ReportContext = createContext<ReportContextState>({
  filters: {},
  updateFilters: () => {}
});

// Custom hook for using the report context
export const useReportContext = () => useContext(ReportContext);

// Props for the provider component
interface ReportProviderProps {
  children: ReactNode;
}

// Provider component
export const ReportProvider: React.FC<ReportProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<ReportFilterParams>({});

  const updateFilters = (newFilters: ReportFilterParams) => {
    setFilters(newFilters);
  };

  return (
    <ReportContext.Provider value={{ filters, updateFilters }}>
      {children}
    </ReportContext.Provider>
  );
};