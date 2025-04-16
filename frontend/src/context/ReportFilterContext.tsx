import { createContext, useContext, useState, ReactNode } from 'react';
import { ReportFilterParams } from '@/types/report';

interface ReportFilterContextType {
  filters: ReportFilterParams;
  setFilters: (filters: ReportFilterParams) => void;
  updateFilter: <K extends keyof ReportFilterParams>(
    key: K,
    value: ReportFilterParams[K]
  ) => void;
  resetFilters: () => void;
}

const defaultFilters: ReportFilterParams = {
  limit: 10,
  offset: 0,
  sortBy: 'date',
  sortDirection: 'desc',
};

const ReportFilterContext = createContext<ReportFilterContextType | undefined>(undefined);

export function ReportFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<ReportFilterParams>(defaultFilters);

  const updateFilter = <K extends keyof ReportFilterParams>(
    key: K,
    value: ReportFilterParams[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset offset when changing filters to return to first page
      ...(key !== 'offset' ? { offset: 0 } : {}),
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <ReportFilterContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        resetFilters,
      }}
    >
      {children}
    </ReportFilterContext.Provider>
  );
}

export function useReportFilters() {
  const context = useContext(ReportFilterContext);
  if (context === undefined) {
    throw new Error('useReportFilters must be used within a ReportFilterProvider');
  }
  return context;
}