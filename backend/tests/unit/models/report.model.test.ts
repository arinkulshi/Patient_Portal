// backend/tests/unit/models/report.model.test.ts
import { ReportModel } from '../../../src/models/report.model';
import { Report} from '../../../src/types';

describe('ReportModel', () => {

  const sampleReportData: Partial<Report> = {
    patientName: 'Test Patient',
    patientId: 'TEST001',
    summary: 'Test summary',
    type: 'General'
  };

  describe('constructor', () => {
    it('should create a new report with defaults for missing fields', () => {
      const report = new ReportModel(sampleReportData);
      
      
      expect(report.patientName).toBe(sampleReportData.patientName);
      expect(report.patientId).toBe(sampleReportData.patientId);
      expect(report.summary).toBe(sampleReportData.summary);
      expect(report.type).toBe(sampleReportData.type);
      
      
      expect(report.id).toBeDefined();
      expect(report.date).toBeDefined();
      expect(report.createdAt).toBeDefined();
      expect(report.updatedAt).toBeDefined();
    });

    it('should use provided values instead of defaults', () => {
      const now = new Date().toISOString();
      const customId = 'custom-id-123';
      
      const reportWithCustomValues = new ReportModel({
        ...sampleReportData,
        id: customId,
        date: now,
        createdAt: now,
        updatedAt: now
      });
      
      expect(reportWithCustomValues.id).toBe(customId);
      expect(reportWithCustomValues.date).toBe(now);
      expect(reportWithCustomValues.createdAt).toBe(now);
      expect(reportWithCustomValues.updatedAt).toBe(now);
    });
  });

  describe('update', () => {
    it('should update the report with new values', () => {
      const report = new ReportModel(sampleReportData);
      const initialDate = report.date;
      const initialUpdatedAt = report.updatedAt;
      
      
      jest.advanceTimersByTime(1000);
      
      const newData: Partial<Report> = {
        patientName: 'Updated Patient',
        summary: 'Updated summary',
      };
      
      report.update(newData);
      
     
      expect(report.patientName).toBe(newData.patientName);
      expect(report.summary).toBe(newData.summary);
      
      
      expect(report.date).toBe(initialDate);
      
      
      expect(report.updatedAt).not.toBe(initialUpdatedAt);
    });

    it('should only update fields that are provided', () => {
      const report = new ReportModel(sampleReportData);
      const originalType = report.type;
      
      report.update({
        patientName: 'New Name',
        
      });
      
      expect(report.patientName).toBe('New Name');
      expect(report.type).toBe(originalType); 
    });
  });

  describe('toJSON', () => {
    it('should return a plain object representation of the report', () => {
      const report = new ReportModel(sampleReportData);
      const json = report.toJSON();
      
      
      expect(json).toEqual({
        id: report.id,
        patientName: report.patientName,
        patientId: report.patientId,
        date: report.date,
        summary: report.summary,
        type: report.type,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt
      });
      
      // Make sure it's not an instance of ReportModel
      expect(json instanceof ReportModel).toBe(false);
    });
  });

  describe('fromJSON', () => {
    it('should create a ReportModel instance from a plain object', () => {
      const plainObject: Report = {
        id: 'test-id',
        patientName: 'JSON Patient',
        patientId: 'JSON001',
        date: '2025-04-01T10:00:00Z',
        summary: 'Created from JSON',
        type: 'Test',
        createdAt: '2025-04-01T10:00:00Z',
        updatedAt: '2025-04-01T10:00:00Z'
      };
      
      const report = ReportModel.fromJSON(plainObject);
      
      
      expect(report).toBeInstanceOf(ReportModel);
      
      
      expect(report.id).toBe(plainObject.id);
      expect(report.patientName).toBe(plainObject.patientName);
      expect(report.patientId).toBe(plainObject.patientId);
      expect(report.date).toBe(plainObject.date);
      expect(report.summary).toBe(plainObject.summary);
      expect(report.type).toBe(plainObject.type);
      expect(report.createdAt).toBe(plainObject.createdAt);
      expect(report.updatedAt).toBe(plainObject.updatedAt);
    });
  });
});