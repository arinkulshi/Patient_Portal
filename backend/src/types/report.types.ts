
export interface Report {
    id: string;
    patientName: string;
    patientId: string;
    date: string;  
    summary: string;
    type: string; 
    createdAt: string;
    updatedAt: string;
  }
  
  
  export interface ReportFilterParams {
    patientName?: string;
    patientId?: string;
    type?: string;
    fromDate?: string;
    toDate?: string;
  }
  
 
  export interface ReportListResponse {
    data: Report[];
    total: number;
    page: number;
    limit: number;
  }
  

  export interface ErrorResponse {
    message: string;
    code: string;
    timestamp: string;
  }