import { Report } from '../../../src/types';
import { sampleReports } from '../../fixtures/test-report';
import { AppError } from '../../../src/middleware/error.middleware';
import { MockStorage } from '../../fixtures/storage.mock';

const mockStorageInstance = new MockStorage<Report>(sampleReports);

jest.doMock('../../../src/storage/in-memory.storage', () => ({
  InMemoryStorage: jest.fn().mockImplementation(() => mockStorageInstance),
}));

const { ReportRepository } = require('../../../src/repositories/report.repository')

describe('ReportRepository', () => {
  let repository: typeof ReportRepository;
  
  beforeEach(() => {
    
    mockStorageInstance.reset([...sampleReports]);
    
    repository = new ReportRepository();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('findAll', () => {
    it('should return all reports when no filters are provided', async () => {
      const reports = await repository.findAll();
      
      expect(reports).toHaveLength(sampleReports.length);
      expect(reports).toEqual(expect.arrayContaining(sampleReports));
    });
    
    it('should filter reports by patientName', async () => {
      const patientName = 'John Smith';
      const reports = await repository.findAll({ patientName });
      
      expect(reports.length).toBeGreaterThan(0);
      reports.forEach((report: Report) => {
        expect(report.patientName.toLowerCase()).toContain(patientName.toLowerCase());
      });
    });
    
    it('should filter reports by patientId', async () => {
      const patientId = 'P001';
      const reports = await repository.findAll({ patientId });
      
      expect(reports.length).toBeGreaterThan(0); 
      reports.forEach((report: Report) => {
        expect(report.patientId).toBe(patientId);
      });
    });
    
    it('should filter reports by type', async () => {
      const type = 'Lab';
      const reports = await repository.findAll({ type });
      
      expect(reports.length).toBeGreaterThan(0); 
      reports.forEach((report: Report) => {
        expect(report.type).toBe(type);
      });
    });
    
    it('should filter reports by date range', async () => {
      const fromDate = '2025-03-10T00:00:00Z';
      const toDate = '2025-03-15T23:59:59Z';
      const reports = await repository.findAll({ fromDate, toDate });
      
      expect(reports.length).toBeGreaterThan(0);
      reports.forEach((report: Report) => {
        const reportDate = new Date(report.date).getTime();
        const from = new Date(fromDate).getTime();
        const to = new Date(toDate).getTime();
        
        expect(reportDate).toBeGreaterThanOrEqual(from);
        expect(reportDate).toBeLessThanOrEqual(to);
      });
    });
    
    it('should combine multiple filter criteria', async () => {
      const filters = {
        patientName: 'John Smith',
        type: 'General'
      };
      
      const reports = await repository.findAll(filters);
      
      expect(reports.length).toBeGreaterThanOrEqual(0); 
      reports.forEach((report: Report) => {
        expect(report.patientName).toBe(filters.patientName);
        expect(report.type).toBe(filters.type);
      });
    });
  });
  
 
  
  describe('findById', () => {
    it('should return a report when a valid id is provided', async () => {
      const id = '1';
      const report = await repository.findById(id);
      
      expect(report).not.toBeNull();
      expect(report?.id).toBe(id);
    });
    
    it('should return null when an invalid id is provided', async () => {
      const report = await repository.findById('non-existent-id');
      
      expect(report).toBeNull();
    });
  });
  
  describe('create', () => {
    it('should create a new report', async () => {
      const newReport: Partial<Report> = {
        patientName: 'New Patient',
        patientId: 'NEW001',
        summary: 'New patient report',
        type: 'General'
      };
      
      const createdReport = await repository.create(newReport);
      
      expect(createdReport.id).toBeDefined();
      expect(createdReport.patientName).toBe(newReport.patientName);
      expect(createdReport.patientId).toBe(newReport.patientId);
      expect(createdReport.summary).toBe(newReport.summary);
      expect(createdReport.type).toBe(newReport.type);
      
    
      const retrievedReport = await repository.findById(createdReport.id);
      expect(retrievedReport).not.toBeNull();
      expect(retrievedReport?.id).toBe(createdReport.id);
    });
  });
  
  describe('update', () => {
    it('should update an existing report', async () => {
      const id = '1';
      const updates: Partial<Report> = {
        summary: 'Updated summary',
        type: 'Updated Type'
      };
      
      const updatedReport = await repository.update(id, updates);
      
      expect(updatedReport).not.toBeNull();
      expect(updatedReport?.id).toBe(id);
      expect(updatedReport?.summary).toBe(updates.summary);
      expect(updatedReport?.type).toBe(updates.type);
      
      
      expect(updatedReport?.patientName).toBe(sampleReports[0].patientName);
      expect(updatedReport?.patientId).toBe(sampleReports[0].patientId);
    });
    
    it('should throw an error when trying to update a non-existent report', async () => {
      const id = 'non-existent-id';
      const updates: Partial<Report> = {
        summary: 'This update should fail'
      };
      
      await expect(repository.update(id, updates))
        .rejects
        .toThrow(AppError);
    });
  });
  
  describe('delete', () => {
    it('should delete an existing report', async () => {
      const id = '1';
      
      const result = await repository.delete(id);
      
      expect(result).toBe(true);
      
      
      const report = await repository.findById(id);
      expect(report).toBeNull();
    });
    
    it('should throw an error when trying to delete a non-existent report', async () => {
      const id = 'non-existent-id';
      
      await expect(repository.delete(id))
        .rejects
        .toThrow(AppError);
    });
  });
  
  describe('count', () => {
    it('should return the total count of reports when no filters are provided', async () => {
      const count = await repository.count();
      
      expect(count).toBe(sampleReports.length);
    });
    
    it('should return filtered count when filters are provided', async () => {
      const patientName = 'John Smith';
      const count = await repository.count({ patientName });
      
      expect(count).toBeGreaterThan(0); 
    });
  });
  
  describe('findWithPagination', () => {
    it('should return paginated results', async () => {
      const limit = 2;
      const offset = 0;
      
      const result = await repository.findWithPagination({}, { limit, offset });
      
      expect(result.data).toHaveLength(limit);
      expect(result.total).toBe(sampleReports.length);
      expect(result.limit).toBe(limit);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(Math.ceil(sampleReports.length / limit));
    });
    
    it('should handle pagination with filters', async () => {
      const patientName = 'John Smith';
      const limit = 1;
      const offset = 0;
      
      const result = await repository.findWithPagination({ patientName }, { limit, offset });
      
      expect(result.data.length).toBeLessThanOrEqual(limit);
      if (result.data.length > 0) {
        expect(result.data[0].patientName).toBe(patientName);
      }
    });
    
    it('should handle offset for pagination', async () => {
      const limit = 2;
      const offset = 2;
      
      const result = await repository.findWithPagination({}, { limit, offset });
      
      expect(result.data.length).toBeLessThanOrEqual(limit);
      expect(result.page).toBe(2); 
    });
    
    it('should handle sorting', async () => {
      const options = {
        limit: 5,
        offset: 0,
        sortBy: 'patientName',
        sortDirection: 'asc' as const
      };
      
      const result = await repository.findWithPagination({}, options);
      
      for (let i = 1; i < result.data.length; i++) {
        expect(result.data[i - 1].patientName <= result.data[i].patientName).toBe(true);
      }
    });
  });
});
