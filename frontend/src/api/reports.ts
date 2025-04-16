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

 
  getReportById: async (id: string): Promise<ReportResponse> => {
    return await apiClient.get<ReportResponse>(`/reports/${id}`);
  },

  
  createReport: async (data: CreateReportParams): Promise<CreateReportResponse> => {
    return await apiClient.post<CreateReportResponse>('/reports', data);
  },

 
  updateReport: async (id: string, data: UpdateReportParams): Promise<UpdateReportResponse> => {
    return await apiClient.put<UpdateReportResponse>(`/reports/${id}`, data);
  },

  
  deleteReport: async (id: string): Promise<void> => {
    await apiClient.delete(`/reports/${id}`);
  }
};