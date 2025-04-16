import { useState, useEffect } from 'react';
import { reportService } from '@/api/reports';
import { Report, CreateReportParams, UpdateReportParams } from '@/types/report';
import { AxiosError } from 'axios';
import { ApiError } from '@/api/types';

interface UseReportResult {
  report: Report | null;
  loading: boolean;
  error: string | null;
  fetchReport: (id: string) => Promise<void>;
  createReport: (data: CreateReportParams) => Promise<Report | null>;
  updateReport: (id: string, data: UpdateReportParams) => Promise<Report | null>;
}

export function useReport(id?: string): UseReportResult {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async (reportId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await reportService.getReportById(reportId);
      setReport(response);
      console.log('Report loaded:', response);

    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data.error.message || 'Failed to fetch report';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (data: CreateReportParams): Promise<Report | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await reportService.createReport(data);
      const createdReport = response.data;
      setReport(createdReport);
      return createdReport;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data.error.message || 'Failed to create report';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateReport = async (reportId: string, data: UpdateReportParams): Promise<Report | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await reportService.updateReport(reportId, data);
      const updatedReport = response.data;
      setReport(updatedReport);
      return updatedReport;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data.error.message || 'Failed to update report';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReport(id);
    }
  }, [id]);

  return {
    report,
    loading,
    error,
    fetchReport,
    createReport,
    updateReport
  };
}