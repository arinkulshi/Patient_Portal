/**
 * Report interface representing a patient medical report
 */
export interface Report {
    id: string;
    patientName: string;
    patientId: string;
    date: string;  // ISO format date
    summary: string;
    type: string;  // e.g., "Lab", "Radiology", "General"
    createdAt: string;
    updatedAt: string;
  }
  
  /**
   * Parameters for filtering reports
   */
  export interface ReportFilterParams {
    patientName?: string;
    patientId?: string;
    type?: string;
    fromDate?: string;
    toDate?: string;
  }
  
  /**
   * Response structure for report list API
   */
  export interface ReportListResponse {
    data: Report[];
    total: number;
    page: number;
    limit: number;
  }
  
  /**
   * Error response structure
   */
  export interface ErrorResponse {
    message: string;
    code: string;
    timestamp: string;
  }