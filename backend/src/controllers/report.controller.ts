// backend/src/controllers/report.controller.ts
import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/report.service';
import { extractReportFilters, extractPaginationOptions } from '../utils/param-sanitizer';
import { invalidateCache } from '../middleware/cache.middleware';
import { AppError } from '../middleware/error.middleware';

/**
 * Get all reports with optional filtering and pagination
 * @route GET /api/v1/reports
 */
export const getAllReports = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract and sanitize filter parameters
    const filterParams = extractReportFilters(req);
    
    // Extract and validate pagination options
    const options = extractPaginationOptions(req);
    
    // Log the request for debugging
    console.log(`Getting reports with filters: ${JSON.stringify(filterParams)}`);
    console.log(`Pagination options: ${JSON.stringify(options)}`);
    
    // Get paginated reports
    const result = await reportService.getReports(filterParams, options);
    
    // Send response
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get report by ID
 * @route GET /api/v1/reports/:id
 */
export const getReportById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw new AppError('Report ID is required', 400, 'MISSING_PARAMETER');
    }
    
    const report = await reportService.getReportById(id);
    
    // Send response
    res.json(report);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new report
 * @route POST /api/v1/reports
 */
export const createReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reportData = req.body;
    
    const report = await reportService.createReport(reportData);
    
    invalidateCache('GET:/api/v1/reports');
    
    res.status(201).json({
      message: 'Report created successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing report
 * @route 
 */
export const updateReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const reportData = req.body;
    
    if (!id) {
      throw new AppError('Report ID is required', 400, 'MISSING_PARAMETER');
    }
    
    const report = await reportService.updateReport(id, reportData);
    
    invalidateCache(`GET:/api/v1/reports/${id}`); 
    invalidateCache('GET:/api/v1/reports');       
    
   
    res.json({
      message: 'Report updated successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete report
 * @route DELETE /api/v1/reports/:id
 */
export const deleteReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw new AppError('Report ID is required', 400, 'MISSING_PARAMETER');
    }
    
  
    await reportService.deleteReport(id);
    
    invalidateCache(`GET:/api/v1/reports/${id}`); 
    invalidateCache('GET:/api/v1/reports');       
    
 
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};