// backend/src/routes/report.routes.ts
import { Router } from 'express';
import * as reportController from '../controllers/report.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { cacheMiddleware } from '../middleware/cache.middleware';
import cacheConfig from '../config/cache.config';

const router = Router();

/**
 * @route   GET /api/v1/reports
 * @desc    Get all reports with optional filtering
 * @access  Public
 */
router.get('/', 
  cacheMiddleware(cacheConfig.endpoints.getAllReports.ttl),
  validateRequest([
    {
      field: 'patientName',
      location: 'query',
      type: 'string',
      required: false
    },
    {
      field: 'limit',
      location: 'query',
      type: 'string',
      required: false,
      custom: (value) => !value || !isNaN(parseInt(value, 10)),
      message: 'limit must be a valid number'
    },
    {
      field: 'offset',
      location: 'query',
      type: 'string',
      required: false,
      custom: (value) => !value || !isNaN(parseInt(value, 10)),
      message: 'offset must be a valid number'
    }
  ]), 
  reportController.getAllReports
);

/**
 * @route   GET /api/v1/reports/:id
 * @desc    Get a report by ID
 * @access  Public
 */
router.get('/:id', 
  cacheMiddleware(cacheConfig.endpoints.getReportById.ttl),
  validateRequest([
    {
      field: 'id',
      location: 'params',
      type: 'string',
      required: true,
      message: 'Report ID is required'
    }
  ]), 
  reportController.getReportById
);

/**
 * @route   POST /api/v1/reports
 * @desc    Create a new report (for testing/development)
 * @access  Public
 */
router.post('/', 
  validateRequest([
    {
      field: 'patientName',
      location: 'body',
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Patient name is required and must be between 2 and 100 characters'
    },
    {
      field: 'summary',
      location: 'body',
      type: 'string',
      required: true,
      minLength: 10,
      maxLength: 2000,
      message: 'Summary is required and must be between 10 and 2000 characters'
    },
    {
      field: 'type',
      location: 'body',
      type: 'string',
      required: false
    }
  ]), 
  reportController.createReport
);

/**
 * @route   PUT /api/v1/reports/:id
 * @desc    Update an existing report (for testing/development)
 * @access  Public
 */
router.put('/:id', 
  validateRequest([
    {
      field: 'id',
      location: 'params',
      type: 'string',
      required: true,
      message: 'Report ID is required'
    }
  ]), 
  reportController.updateReport
);

/**
 * @route   DELETE /api/v1/reports/:id
 * @desc    Delete a report (for testing/development)
 * @access  Public
 */
router.delete('/:id', 
  validateRequest([
    {
      field: 'id',
      location: 'params',
      type: 'string',
      required: true,
      message: 'Report ID is required'
    }
  ]), 
  reportController.deleteReport
);

export default router;