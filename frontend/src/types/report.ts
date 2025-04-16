export type ReportType = 'General' | 'Lab' | 'Radiology' | 'Pulmonology' | 'Cardiology' | 'Neurology' | 'Other';

export interface Report {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  summary: string;
  type: ReportType;
  createdAt: string;
  updatedAt: string;
}

export interface ReportFilterParams {
  patientName?: string;
  patientId?: string;
  type?: ReportType;
  fromDate?: string;
  toDate?: string;
  limit?: number;
  offset?: number;
  sortBy?: keyof Report;
  sortDirection?: 'asc' | 'desc';
}

export interface CreateReportParams {
  patientName: string;
  patientId?: string;
  date?: string;
  summary: string;
  type?: ReportType;
}

export interface UpdateReportParams {
  patientName?: string;
  patientId?: string;
  date?: string;
  summary?: string;
  type?: ReportType;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}