// backend/tests/fixtures/test-reports.ts
import { Report } from '../../src/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a test report with optional overrides
 */
export const generateTestReport = (overrides?: Partial<Report>): Report => {
  const now = new Date().toISOString();
  
  return {
    id: uuidv4(),
    patientName: 'Test Patient',
    patientId: 'TEST001',
    date: now,
    summary: 'This is a test report summary.',
    type: 'General',
    createdAt: now,
    updatedAt: now,
    ...overrides
  };
};

/**
 * Generate multiple test reports
 */
export const generateTestReports = (count: number): Report[] => {
  return Array(count)
    .fill(null)
    .map((_, index) => generateTestReport({
      id: uuidv4(),
      patientName: `Test Patient ${index + 1}`,
      patientId: `TEST${String(index + 1).padStart(3, '0')}`,
      summary: `This is test report number ${index + 1}.`
    }));
};

/**
 * Sample reports for testing
 */
export const sampleReports: Report[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientId: 'P001',
    date: '2025-03-15T10:30:00Z',
    summary: 'Patient presented with mild fever and cough. Chest X-ray shows no signs of pneumonia.',
    type: 'General',
    createdAt: '2025-03-15T10:30:00Z',
    updatedAt: '2025-03-15T10:30:00Z'
  },
  {
    id: '2',
    patientName: 'Jane Doe',
    patientId: 'P002',
    date: '2025-03-14T14:45:00Z',
    summary: 'Blood test reveals elevated cholesterol levels. Patient also shows signs of tachycardia during physical examination.',
    type: 'Lab',
    createdAt: '2025-03-14T14:45:00Z',
    updatedAt: '2025-03-14T14:45:00Z'
  },
  {
    id: '3',
    patientName: 'Bob Johnson',
    patientId: 'P003',
    date: '2025-03-10T09:15:00Z',
    summary: 'MRI scan of right knee shows minor tear in the meniscus. Physical therapy recommended.',
    type: 'Radiology',
    createdAt: '2025-03-10T09:15:00Z',
    updatedAt: '2025-03-10T09:15:00Z'
  },
  {
    id: '4',
    patientName: 'Sarah Williams',
    patientId: 'P004',
    date: '2025-03-08T11:00:00Z',
    summary: 'Patient reports intermittent chest pain. ECG shows possible arrhythmia. Referred to cardiologist.',
    type: 'Cardiology',
    createdAt: '2025-03-08T11:00:00Z',
    updatedAt: '2025-03-08T11:00:00Z'
  },
  {
    id: '5',
    patientName: 'John Smith',
    patientId: 'P001',
    date: '2025-02-28T09:00:00Z',
    summary: 'Follow-up for respiratory infection. Symptoms have improved.',
    type: 'Pulmonology',
    createdAt: '2025-02-28T09:00:00Z',
    updatedAt: '2025-02-28T09:00:00Z'
  }
];

// Create a JSON file for the sample reports
export const createTestReportsJson = (): string => {
  return JSON.stringify(sampleReports, null, 2);
};


