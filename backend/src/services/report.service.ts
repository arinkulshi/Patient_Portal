// backend/src/services/report.service.ts
import { Report, ReportFilterParams } from '../types';
import { reportRepository, ReportRepository } from '../repositories/report.repository';
import { FilterOptions, PaginatedResult } from '../repositories/base.repository';
import { AppError } from '../middleware/error.middleware';


export class ReportService {
  private repository: ReportRepository;
  
  constructor(repository: ReportRepository = reportRepository) {
    this.repository = repository;
  }
  
 
  async initialize(): Promise<void> {
    await this.repository.initialize();
  }
  
 
  async getReports(
    filterParams?: ReportFilterParams,
    options?: FilterOptions
  ): Promise<PaginatedResult<Report>> {
    return this.repository.findWithPagination(filterParams, options);
  }
  
 
  async getReportById(id: string): Promise<Report> {
    const report = await this.repository.findById(id);
    
    if (!report) {
      throw new AppError(`Report with id ${id} not found`, 404, 'REPORT_NOT_FOUND');
    }
    
    return report;
  }
  
 
  async createReport(reportData: Partial<Report>): Promise<Report> {
    this.validateReportData(reportData);
    
    // Set default values for missing fields
    if (!reportData.date) {
      reportData.date = new Date().toISOString();
    }
    
    return this.repository.create(reportData);
  }
  
 
  async updateReport(id: string, reportData: Partial<Report>): Promise<Report> {
    await this.getReportById(id);
    
    const updatedReport = await this.repository.update(id, reportData);
    
    if (!updatedReport) {
      throw new AppError(`Failed to update report with id ${id}`, 500, 'UPDATE_FAILED');
    }
    
    return updatedReport;
  }
  
 
  async deleteReport(id: string): Promise<void> {
    await this.getReportById(id);
    
    const success = await this.repository.delete(id);
    
    if (!success) {
      throw new AppError(`Failed to delete report with id ${id}`, 500, 'DELETE_FAILED');
    }
  }
  

  async getPatientReports(patientName: string, options?: FilterOptions): Promise<PaginatedResult<Report>> {
    return this.getReports({ patientName }, options);
  }
  
 
  async getReportsWithMedicalAlerts(options?: FilterOptions): Promise<Report[]> {
    const allReports = await this.repository.findAll();
    
    const alertKeywords = ['tachycardia', 'arrhythmia'];
    
    const alertReports = allReports.filter(report => 
      alertKeywords.some(keyword => 
        report.summary.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    return alertReports;
  }
  
 
  private validateReportData(reportData: Partial<Report>): void {
    if (!reportData.patientName) {
      throw new AppError('Patient name is required', 400, 'VALIDATION_ERROR');
    }
    
    if (!reportData.summary) {
      throw new AppError('Report summary is required', 400, 'VALIDATION_ERROR');
    }
    
    if (!reportData.type) {
      reportData.type = 'General';
    }
  }
}

export const reportService = new ReportService();