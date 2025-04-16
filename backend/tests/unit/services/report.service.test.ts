// backend/tests/unit/services/report.service.test.ts
import { ReportService } from '../../../src/services/report.service';
import { ReportRepository } from '../../../src/repositories/report.repository';
import { Report } from '../../../src/types';
import { sampleReports } from '../../fixtures/test-report';
import { AppError } from '../../../src/middleware/error.middleware';


const mockRepository = {
  initialize: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
  findWithPagination: jest.fn(),
  close: jest.fn()
} as unknown as jest.Mocked<ReportRepository>;

describe('ReportService', () => {
  let service: ReportService;
  
  beforeEach(() => {
   
    jest.clearAllMocks();
    
  
    service = new ReportService(mockRepository as unknown as ReportRepository);
  });
  
  describe('initialize', () => {
    it('should initialize the repository', async () => {
      await service.initialize();
      
      expect(mockRepository.initialize).toHaveBeenCalled();
    });
  });
  
  describe('getReports', () => {
    it('should call repository.findWithPagination with the provided filters and options', async () => {
      const filters = { patientName: 'Test' };
      const options = { limit: 10, offset: 0 };
      const expectedResult = {
        data: sampleReports,
        total: sampleReports.length,
        page: 1,
        limit: 10,
        totalPages: 1
      };
      
      mockRepository.findWithPagination.mockResolvedValue(expectedResult);
      
      const result = await service.getReports(filters, options);
      
      expect(mockRepository.findWithPagination).toHaveBeenCalledWith(filters, options);
      expect(result).toEqual(expectedResult);
    });
  });
  
  describe('getReportById', () => {
    it('should return a report when a valid id is provided', async () => {
      const id = '1';
      const expectedReport = sampleReports[0];
      
      mockRepository.findById.mockResolvedValue(expectedReport);
      
      const result = await service.getReportById(id);
      
      expect(mockRepository.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedReport);
    });
    
    it('should throw an error when report is not found', async () => {
      const id = 'non-existent-id';
      
      mockRepository.findById.mockResolvedValue(null);
      
      await expect(service.getReportById(id))
        .rejects
        .toThrow(AppError);
    });
  });
  
  describe('createReport', () => {
    it('should create a report with valid data', async () => {
      const reportData = {
        patientName: 'New Patient',
        summary: 'New patient report'
      };
      
      const createdReport = {
        id: 'new-id',
        ...reportData,
        patientId: '',
        date: expect.any(String),
        type: 'General',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      };
      
      mockRepository.create.mockResolvedValue(createdReport);
      
      const result = await service.createReport(reportData);
      
      expect(mockRepository.create).toHaveBeenCalled();
      expect(result).toEqual(createdReport);
    });
    
    it('should throw an error when required fields are missing', async () => {
      const invalidData = {
        type: 'General'
      };
      
      await expect(service.createReport(invalidData))
        .rejects
        .toThrow(AppError);
      
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
    
    it('should set default values for missing optional fields', async () => {
      const minimalData = {
        patientName: 'Test Patient',
        summary: 'Test summary'
      };
      
      const expectedReport = {
        id: expect.any(String),
        ...minimalData,
        patientId: '',
        date: expect.any(String),
        type: 'General',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      };
      
      mockRepository.create.mockImplementation(async (data) => data as Report);
      
      const result = await service.createReport(minimalData);
      
      expect(mockRepository.create).toHaveBeenCalled();
      expect(result.type).toBe('General');
      expect(result.date).toBeDefined();
    });
  });
  
  describe('updateReport', () => {
    it('should update a report when valid id and data are provided', async () => {
      const id = '1';
      const updateData = {
        summary: 'Updated summary'
      };
      
      const updatedReport = {
        ...sampleReports[0],
        ...updateData
      };
      
      mockRepository.findById.mockResolvedValue(sampleReports[0]);
      mockRepository.update.mockResolvedValue(updatedReport);
      
      const result = await service.updateReport(id, updateData);
      
      expect(mockRepository.findById).toHaveBeenCalledWith(id);
      expect(mockRepository.update).toHaveBeenCalledWith(id, updateData);
      expect(result).toEqual(updatedReport);
    });
    
    it('should throw an error when report is not found', async () => {
      const id = 'non-existent-id';
      const updateData = { summary: 'This update should fail' };
      
      mockRepository.findById.mockResolvedValue(null);
      
      await expect(service.updateReport(id, updateData))
        .rejects
        .toThrow(AppError);
      
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
    
    it('should throw an error when update fails', async () => {
      const id = '1';
      const updateData = { summary: 'This update should fail' };
      
      mockRepository.findById.mockResolvedValue(sampleReports[0]);
      mockRepository.update.mockResolvedValue(null);
      
      await expect(service.updateReport(id, updateData))
        .rejects
        .toThrow(AppError);
    });
  });
  
  describe('deleteReport', () => {
    it('should delete a report when a valid id is provided', async () => {
      const id = '1';
      
      mockRepository.findById.mockResolvedValue(sampleReports[0]);
      mockRepository.delete.mockResolvedValue(true);
      
      await service.deleteReport(id);
      
      expect(mockRepository.findById).toHaveBeenCalledWith(id);
      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });
    
    it('should throw an error when report is not found', async () => {
      const id = 'non-existent-id';
      
      mockRepository.findById.mockResolvedValue(null);
      
      await expect(service.deleteReport(id))
        .rejects
        .toThrow(AppError);
      
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
    
    it('should throw an error when delete fails', async () => {
      const id = '1';
      
      mockRepository.findById.mockResolvedValue(sampleReports[0]);
      mockRepository.delete.mockResolvedValue(false);
      
      await expect(service.deleteReport(id))
        .rejects
        .toThrow(AppError);
    });
  });
  
  describe('getPatientReports', () => {
    it('should get reports for a specific patient', async () => {
      const patientName = 'John Smith';
      const options = { limit: 10, offset: 0 };
      
      const johnSmithReports = sampleReports.filter(r => r.patientName === patientName);
      const expectedResult = {
        data: johnSmithReports,
        total: johnSmithReports.length,
        page: 1,
        limit: 10,
        totalPages: 1
      };
      
      mockRepository.findWithPagination.mockResolvedValue(expectedResult);
      
      const result = await service.getPatientReports(patientName, options);
      
      expect(mockRepository.findWithPagination).toHaveBeenCalledWith({ patientName }, options);
      expect(result).toEqual(expectedResult);
    });
  });
  
  describe('getReportsWithMedicalAlerts', () => {
    it('should get reports containing medical alerts', async () => {
      const alertReports = sampleReports.filter(r => 
        r.summary.toLowerCase().includes('tachycardia') || 
        r.summary.toLowerCase().includes('arrhythmia')
      );
      
      mockRepository.findAll.mockResolvedValue(sampleReports);
      
      const result = await service.getReportsWithMedicalAlerts();
      
      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(alertReports.length);
      
     
      result.forEach(report => {
        const containsAlert = 
          report.summary.toLowerCase().includes('tachycardia') || 
          report.summary.toLowerCase().includes('arrhythmia');
        
        expect(containsAlert).toBe(true);
      });
    });
  });
});