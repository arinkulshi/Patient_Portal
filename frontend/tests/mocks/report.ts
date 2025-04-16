import { Report, ReportType } from '../../src/types/report';

export const mockReports: Report[] = [
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
    date: '2025-03-14T09:15:00Z',
    summary: 'Annual checkup. Patient is in good health with normal vitals. Recommended routine blood work.',
    type: 'General',
    createdAt: '2025-03-14T09:15:00Z',
    updatedAt: '2025-03-14T09:15:00Z'
  },
  {
    id: '3',
    patientName: 'Robert Johnson',
    patientId: 'P003',
    date: '2025-03-13T14:45:00Z',
    summary: 'Follow-up for hypertension. Blood pressure is 140/90, slightly elevated. Adjusted medication dosage.',
    type: 'Cardiology',
    createdAt: '2025-03-13T14:45:00Z',
    updatedAt: '2025-03-13T14:45:00Z'
  },
  {
    id: '4',
    patientName: 'Mary Williams',
    patientId: 'P004',
    date: '2025-03-12T11:00:00Z',
    summary: 'Lab results show elevated blood glucose levels. Patient referred to endocrinology for diabetes evaluation.',
    type: 'Lab',
    createdAt: '2025-03-12T11:00:00Z',
    updatedAt: '2025-03-12T11:00:00Z'
  },
  {
    id: '5',
    patientName: 'Michael Brown',
    patientId: 'P005',
    date: '2025-03-11T15:30:00Z',
    summary: 'Chest X-ray shows early signs of pneumonia in right lower lobe. Prescribed antibiotics and follow-up in one week.',
    type: 'Radiology',
    createdAt: '2025-03-11T15:30:00Z',
    updatedAt: '2025-03-11T15:30:00Z'
  },
  {
    id: '6',
    patientName: 'John Smith',
    patientId: 'P001',
    date: '2025-03-01T10:00:00Z',
    summary: 'Patient reports persistent headaches. Referred to neurology for further evaluation. URGENT follow-up recommended.',
    type: 'Neurology',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z'
  }
];

export const filterReports = (filters: any) => {
  let filteredReports = [...mockReports];
  
  // Apply filters
  if (filters.patientName) {
    const patientName = filters.patientName.toLowerCase();
    filteredReports = filteredReports.filter(report => 
      report.patientName.toLowerCase().includes(patientName)
    );
  }
  
  if (filters.patientId) {
    filteredReports = filteredReports.filter(report => 
      report.patientId === filters.patientId
    );
  }
  
  if (filters.type) {
    filteredReports = filteredReports.filter(report => 
      report.type === filters.type
    );
  }
  
  if (filters.fromDate) {
    const fromDate = new Date(filters.fromDate).getTime();
    filteredReports = filteredReports.filter(report => 
      new Date(report.date).getTime() >= fromDate
    );
  }
  
  if (filters.toDate) {
    const toDate = new Date(filters.toDate).getTime();
    filteredReports = filteredReports.filter(report => 
      new Date(report.date).getTime() <= toDate
    );
  }
  
  // Sort
  const sortField = filters.sortBy || 'date';
  const sortDirection = filters.sortDirection || 'desc';
  
  filteredReports.sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === 'asc' 
      ? (aValue > bValue ? 1 : -1) 
      : (bValue > aValue ? 1 : -1);
  });
  
  // Pagination
  const limit = Number(filters.limit) || 10;
  const offset = Number(filters.offset) || 0;
  
  const paginatedReports = filteredReports.slice(offset, offset + limit);
  
  return {
    data: paginatedReports,
    total: filteredReports.length,
    page: Math.floor(offset / limit) + 1,
    limit,
    totalPages: Math.ceil(filteredReports.length / limit)
  };
};

export const getReportById = (id: string) => {
  return mockReports.find(report => report.id === id);
};