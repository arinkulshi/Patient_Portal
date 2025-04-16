// backend/src/repositories/report.repository.ts
import { Report, ReportFilterParams } from '../types';
import { ReportModel } from '../models/report.model';
import { IRepository, FilterOptions, PaginatedResult } from './base.repository';
import { InMemoryStorage } from '../storage/in-memory.storage';
import { AppError } from '../middleware/error.middleware';


export class ReportRepository implements IRepository<Report> {
  private storage: InMemoryStorage<Report>;
  
  constructor() {
    this.storage = new InMemoryStorage<Report>('reports');
  }
  
  
  async initialize(): Promise<void> {
    await this.storage.initialize();
  }
  

  async findAll(filters?: ReportFilterParams & FilterOptions): Promise<Report[]> {
    if (!filters || Object.keys(filters).length === 0) {
      return this.storage.getAll();
    }
    
    const filterFunction = this.createFilterFunction(filters);
    
    return this.storage.query(filterFunction);
  }
  
 
  private createFilterFunction(filters: ReportFilterParams): (report: Report) => boolean {
    const patientNameLower = filters.patientName?.toLowerCase();
    const fromDate = filters.fromDate ? new Date(filters.fromDate).getTime() : null;
    const toDate = filters.toDate ? new Date(filters.toDate).getTime() : null;
    
    return (report: Report): boolean => {
      if (patientNameLower && !report.patientName.toLowerCase().includes(patientNameLower)) {
        return false;
      }
      
      if (filters.patientId && report.patientId !== filters.patientId) {
        return false;
      }
      
      if (filters.type && report.type !== filters.type) {
        return false;
      }
      
      if (fromDate) {
        const reportDate = new Date(report.date).getTime();
        if (reportDate < fromDate) {
          return false;
        }
      }
      
      if (toDate) {
        const reportDate = new Date(report.date).getTime();
        if (reportDate > toDate) {
          return false;
        }
      }
      
      return true;
    };
  }
  

  async findById(id: string): Promise<Report | null> {
    return this.storage.getById(id);
  }
  

  async create(reportData: Partial<Report>): Promise<Report> {
    const report = new ReportModel(reportData);
    return this.storage.create(report.toJSON());
  }
  
  
  async update(id: string, reportData: Partial<Report>): Promise<Report | null> {
    const existingReport = await this.findById(id);
    
    if (!existingReport) {
      throw new AppError(`Report with id ${id} not found`, 404, 'REPORT_NOT_FOUND');
    }
    
    const report = ReportModel.fromJSON(existingReport);
    report.update(reportData);
    
    return this.storage.update(id, report.toJSON());
  }
  
 
  async delete(id: string): Promise<boolean> {
    const exists = await this.findById(id);
    
    if (!exists) {
      throw new AppError(`Report with id ${id} not found`, 404, 'REPORT_NOT_FOUND');
    }
    
    return this.storage.delete(id);
  }
  
 
  async count(filters?: ReportFilterParams): Promise<number> {
    if (!filters || Object.keys(filters).length === 0) {
      return this.storage.count();
    }
    
    const filterFunction = this.createFilterFunction(filters);
    return this.storage.count(filterFunction);
  }
  
  
  async findWithPagination(
    filters?: ReportFilterParams,
    options: FilterOptions = { limit: 10, offset: 0 }
  ): Promise<PaginatedResult<Report>> {
    const { limit = 10, offset = 0, sortBy = 'date', sortDirection = 'desc' } = options;
    
    const total = await this.count(filters);
    
    if (total === 0) {
      return {
        data: [],
        total: 0,
        page: 1,
        limit,
        totalPages: 0
      };
    }
    
    let reports = await this.findAll(filters);
    
    reports = this.sortReports(reports, sortBy, sortDirection);
    
    reports = reports.slice(offset, offset + limit);
    
    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: reports,
      total,
      page,
      limit,
      totalPages
    };
  }
  
  
  private sortReports(
    reports: Report[],
    sortBy: string = 'date',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Report[] {
    return [...reports].sort((a, b) => {
      let aValue: any = (a as any)[sortBy];
      let bValue: any = (b as any)[sortBy];
      
      if (sortBy === 'date' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }
  

  async close(): Promise<void> {
    await this.storage.close();
  }
}

export const reportRepository = new ReportRepository();