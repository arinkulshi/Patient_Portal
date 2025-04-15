// src/hooks/useReport.ts
import { useState, useEffect } from 'react';
import { reportService } from '../../../backend/src/services/report.service';
import { Report } from '../types';

/**
 * Custom hook for fetching and managing a single report
 */
export const useReport = (id: string) => {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await reportService.getReportById(id);
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch report'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  return { report, loading, error };
};

// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing a value (useful for search inputs)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Update debounced value after specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes or unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}