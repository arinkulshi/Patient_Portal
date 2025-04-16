import { Report, Pagination } from '@/types/report';

export interface ApiError {
  error: {
    code: string;
    message: string;
    timestamp: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends Pagination {
  data: T[];
}

export type ReportsResponse = PaginatedResponse<Report>;
export type ReportResponse = ApiResponse<Report>;
export type CreateReportResponse = ApiResponse<Report>;
export type UpdateReportResponse = ApiResponse<Report>;

export enum ErrorCode {
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_PARAMETER = 'INVALID_PARAMETER',
  MISSING_PARAMETER = 'MISSING_PARAMETER',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  REPORT_NOT_FOUND = 'REPORT_NOT_FOUND',
}