import { rest } from 'msw';
import { mockReports, filterReports, getReportById } from './report';

const API_BASE_URL = 'http://localhost:3001/api/v1';

export const handlers = [
  rest.get(`${API_BASE_URL}/reports`, (req, res, ctx) => {
    const patientName = req.url.searchParams.get('patientName');
    const patientId = req.url.searchParams.get('patientId');
    const type = req.url.searchParams.get('type');
    const fromDate = req.url.searchParams.get('fromDate');
    const toDate = req.url.searchParams.get('toDate');
    const limit = req.url.searchParams.get('limit');
    const offset = req.url.searchParams.get('offset');
    const sortBy = req.url.searchParams.get('sortBy');
    const sortDirection = req.url.searchParams.get('sortDirection');
    
    const filters = {
      patientName,
      patientId,
      type,
      fromDate,
      toDate,
      limit: limit || 10,
      offset: offset || 0,
      sortBy: sortBy || 'date',
      sortDirection: sortDirection || 'desc'
    };
    
    const result = filterReports(filters);
    return res(ctx.status(200), ctx.json(result));
  }),
  
  
  rest.get(`${API_BASE_URL}/reports/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const report = getReportById(id as string);
    
    if (!report) {
      return res(
        ctx.status(404),
        ctx.json({
          error: {
            code: 'REPORT_NOT_FOUND',
            message: `Report with id ${id} not found`,
            timestamp: new Date().toISOString()
          }
        })
      );
    }
    
    return res(ctx.status(200), ctx.json(report));
  }),
  
  // Create new report
  rest.post(`${API_BASE_URL}/reports`, async (req, res, ctx) => {
    const body = await req.json();
    
    // Validate required fields
    if (!body.patientName || !body.summary) {
      return res(
        ctx.status(400),
        ctx.json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Patient name and summary are required',
            timestamp: new Date().toISOString()
          }
        })
      );
    }
    
    const newReport = {
      id: (mockReports.length + 1).toString(),
      patientName: body.patientName,
      patientId: body.patientId || `P${(mockReports.length + 1).toString().padStart(3, '0')}`,
      date: body.date || new Date().toISOString(),
      summary: body.summary,
      type: body.type || 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
   
    return res(
      ctx.status(201),
      ctx.json({
        message: 'Report created successfully',
        data: newReport
      })
    );
  }),
  
  // Update report
  rest.put(`${API_BASE_URL}/reports/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const reportIndex = mockReports.findIndex(r => r.id === id);
    
    if (reportIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({
          error: {
            code: 'REPORT_NOT_FOUND',
            message: `Report with id ${id} not found`,
            timestamp: new Date().toISOString()
          }
        })
      );
    }
    
    const body = await req.json();
    const originalReport = mockReports[reportIndex];
    
    const updatedReport = {
      ...originalReport,
      ...body,
      updatedAt: new Date().toISOString()
    };
    
  
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Report updated successfully',
        data: updatedReport
      })
    );
  }),
  
  
  rest.delete(`${API_BASE_URL}/reports/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const reportIndex = mockReports.findIndex(r => r.id === id);
    
    if (reportIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({
          error: {
            code: 'REPORT_NOT_FOUND',
            message: `Report with id ${id} not found`,
            timestamp: new Date().toISOString()
          }
        })
      );
    }
    
   
    
    return res(ctx.status(204));
  })
];