import { useState, useEffect } from 'react';
import { reportService } from '@/api/reports';
import { Report, ReportFilterParams, Pagination } from '@/types/report';
import { AxiosError } from 'axios';
import { ApiError } from '@/api/types';

interface UseReportsResult {
  reports: Report[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  fetchReports: (params?: ReportFilterParams) => Promise<void>;
  deleteReport: (id: string) => Promise<boolean>;
}

export function useReports(initialFilters?: ReportFilterParams): UseReportsResult {
  const [reports, setReports] = useState<Report[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async (params?: ReportFilterParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const filters = { ...initialFilters, ...params };
      const response = await reportService.getReports(filters);
      
      setReports(response.data);
      
      const { total, page, limit, totalPages } = response;
      setPagination({ total, page, limit, totalPages });
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data.error.message || 'Failed to fetch reports';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id: string): Promise<boolean> => {
    setError(null);
    
    try {
      await reportService.deleteReport(id);
      setReports(reports.filter(report => report.id !== id));
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data.error.message || 'Failed to delete report';
      setError(errorMessage);
      return false;
    }
  };

  useEffect(() => {
    fetchReports(initialFilters);
  }, []);

  return {
    reports,
    pagination,
    loading,
    error,
    fetchReports,
    deleteReport
  };
}