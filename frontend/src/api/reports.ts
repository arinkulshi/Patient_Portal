import { apiClient } from './client';
import { 
  ReportsResponse, 
  ReportResponse, 
  CreateReportResponse, 
  UpdateReportResponse 
} from './types';
import { 
  ReportFilterParams, 
  CreateReportParams, 
  UpdateReportParams 
} from '@/types/report';

export const reportService = {
  /**
   * Get all reports with optional filtering
   */
  getReports: async (params?: ReportFilterParams): Promise<ReportsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const url = `/reports${queryString ? `?${queryString}` : ''}`;
    
    return await apiClient.get<ReportsResponse>(url);
  },

  /**
   * Get a specific report by ID
   */
  getReportById: async (id: string): Promise<ReportResponse> => {
    return await apiClient.get<ReportResponse>(`/reports/${id}`);
  },

  /**
   * Create a new report
   */
  createReport: async (data: CreateReportParams): Promise<CreateReportResponse> => {
    return await apiClient.post<CreateReportResponse>('/reports', data);
  },

  /**
   * Update an existing report
   */
  updateReport: async (id: string, data: UpdateReportParams): Promise<UpdateReportResponse> => {
    return await apiClient.put<UpdateReportResponse>(`/reports/${id}`, data);
  },

  /**
   * Delete a report
   */
  deleteReport: async (id: string): Promise<void> => {
    await apiClient.delete(`/reports/${id}`);
  }
};