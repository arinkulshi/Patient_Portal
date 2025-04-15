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
   * Alert keywords that should trigger visual alerts in report summaries
   */
  export const ALERT_KEYWORDS = ['tachycardia', 'arrhythmia'];
  
  /**
   * Functions to check if a report contains alert keywords
   */
  export const containsAlertKeywords = (summary: string): boolean => {
    return ALERT_KEYWORDS.some(keyword => 
      summary.toLowerCase().includes(keyword.toLowerCase())
    );
  };
  
  /**
   * Get all matching alert keywords in a summary
   */
  export const getMatchingAlertKeywords = (summary: string): string[] => {
    return ALERT_KEYWORDS.filter(keyword => 
      summary.toLowerCase().includes(keyword.toLowerCase())
    );
  };
  
  /**
   * Error response structure
   */
  export interface ErrorResponse {
    message: string;
    code: string;
    timestamp: string;
  }