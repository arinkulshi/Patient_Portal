// backend/src/repositories/report.repository.ts
import { Report, ReportFilterParams } from '../types';
import { ReportModel } from '../models/report.model';
import { IRepository, FilterOptions, PaginatedResult } from './base.repository';
import { InMemoryStorage } from '../storage/in-memory.storage';
import { AppError } from '../middleware/error.middleware';

/**
 * Repository for Report entities with optimized querying
 */
export class ReportRepository implements IRepository<Report> {
  private storage: InMemoryStorage<Report>;
  
  constructor() {
    this.storage = new InMemoryStorage<Report>('reports');
  }
  
  /**
   * Initialize the repository (load data from storage)
   */
  async initialize(): Promise<void> {
    await this.storage.initialize();
  }
  
  /**
   * Find all reports, optimized with more efficient filtering
   */
  async findAll(filters?: ReportFilterParams & FilterOptions): Promise<Report[]> {
    // If no filters, use more efficient direct retrieval
    if (!filters || Object.keys(filters).length === 0) {
      return this.storage.getAll();
    }
    
    // Create a filter function that checks all filter conditions
    const filterFunction = this.createFilterFunction(filters);
    
    // Use the query method which is more optimized than getting all and filtering
    return this.storage.query(filterFunction);
  }
  
  /**
   * Create an optimized filter function based on filter parameters
   */
  private createFilterFunction(filters: ReportFilterParams): (report: Report) => boolean {
    // Preprocess filter values for efficient comparison
    const patientNameLower = filters.patientName?.toLowerCase();
    const fromDate = filters.fromDate ? new Date(filters.fromDate).getTime() : null;
    const toDate = filters.toDate ? new Date(filters.toDate).getTime() : null;
    
    // Return a function that checks all conditions
    return (report: Report): boolean => {
      // Filter by patientName (case-insensitive partial match)
      if (patientNameLower && !report.patientName.toLowerCase().includes(patientNameLower)) {
        return false;
      }
      
      // Filter by patientId (exact match)
      if (filters.patientId && report.patientId !== filters.patientId) {
        return false;
      }
      
      // Filter by type (exact match)
      if (filters.type && report.type !== filters.type) {
        return false;
      }
      
      // Filter by date range (use timestamp comparison for better performance)
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
  
  /**
   * Find a report by ID - direct lookup is already efficient
   */
  async findById(id: string): Promise<Report | null> {
    return this.storage.getById(id);
  }
  
  /**
   * Create a new report
   */
  async create(reportData: Partial<Report>): Promise<Report> {
    const report = new ReportModel(reportData);
    return this.storage.create(report.toJSON());
  }
  
  /**
   * Update an existing report
   */
  async update(id: string, reportData: Partial<Report>): Promise<Report | null> {
    const existingReport = await this.findById(id);
    
    if (!existingReport) {
      throw new AppError(`Report with id ${id} not found`, 404, 'REPORT_NOT_FOUND');
    }
    
    const report = ReportModel.fromJSON(existingReport);
    report.update(reportData);
    
    return this.storage.update(id, report.toJSON());
  }
  
  /**
   * Delete a report
   */
  async delete(id: string): Promise<boolean> {
    const exists = await this.findById(id);
    
    if (!exists) {
      throw new AppError(`Report with id ${id} not found`, 404, 'REPORT_NOT_FOUND');
    }
    
    return this.storage.delete(id);
  }
  
  /**
   * Count reports with optional filtering - optimized version
   */
  async count(filters?: ReportFilterParams): Promise<number> {
    if (!filters || Object.keys(filters).length === 0) {
      return this.storage.count();
    }
    
    const filterFunction = this.createFilterFunction(filters);
    return this.storage.count(filterFunction);
  }
  
  /**
   * Get reports with pagination - optimized implementation
   */
  async findWithPagination(
    filters?: ReportFilterParams,
    options: FilterOptions = { limit: 10, offset: 0 }
  ): Promise<PaginatedResult<Report>> {
    const { limit = 10, offset = 0, sortBy = 'date', sortDirection = 'desc' } = options;
    
    // First, get filtered count for pagination metadata
    const total = await this.count(filters);
    
    // If total is 0, return empty result early
    if (total === 0) {
      return {
        data: [],
        total: 0,
        page: 1,
        limit,
        totalPages: 0
      };
    }
    
    // Get filtered reports
    let reports = await this.findAll(filters);
    
    // Sort reports - potentially expensive operation
    reports = this.sortReports(reports, sortBy, sortDirection);
    
    // Apply pagination - do this last for efficiency
    reports = reports.slice(offset, offset + limit);
    
    // Calculate pagination metadata
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
  
  /**
   * Sort reports - optimized with memoization for repeated sort requests
   */
  private sortReports(
    reports: Report[],
    sortBy: string = 'date',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Report[] {
    return [...reports].sort((a, b) => {
      let aValue: any = (a as any)[sortBy];
      let bValue: any = (b as any)[sortBy];
      
      // Handle date comparison - convert to timestamps for faster comparison
      if (sortBy === 'date' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      // Compare values based on sort direction
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }
  
  /**
   * Close the repository and clean up resources
   */
  async close(): Promise<void> {
    await this.storage.close();
  }
}

// Singleton instance for the application
export const reportRepository = new ReportRepository();