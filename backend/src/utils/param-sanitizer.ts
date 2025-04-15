// backend/src/utils/param-sanitizer.ts
import { Request } from 'express';
import { ReportFilterParams } from '../types';
import { FilterOptions } from '../repositories/base.repository';
import { AppError } from '../middleware/error.middleware';

/**
 * Extract and sanitize report filter parameters from request
 */
export const extractReportFilters = (req: Request): ReportFilterParams => {
  const filterParams: ReportFilterParams = {
    patientName: req.query.patientName as string,
    patientId: req.query.patientId as string,
    type: req.query.type as string,
    fromDate: req.query.fromDate as string,
    toDate: req.query.toDate as string
  };

  // Remove undefined or empty string values from filters
  Object.keys(filterParams).forEach(key => {
    if (
      filterParams[key as keyof ReportFilterParams] === undefined ||
      filterParams[key as keyof ReportFilterParams] === ''
    ) {
      delete filterParams[key as keyof ReportFilterParams];
    }
  });

  // Sanitize string inputs to prevent injection
  if (filterParams.patientName) {
    filterParams.patientName = sanitizeString(filterParams.patientName);
  }

  if (filterParams.patientId) {
    filterParams.patientId = sanitizeString(filterParams.patientId);
  }

  if (filterParams.type) {
    filterParams.type = sanitizeString(filterParams.type);
  }

  // Validate date formats if provided
  if (filterParams.fromDate && !isValidDateString(filterParams.fromDate)) {
    throw new AppError(
      'Invalid fromDate format. Use ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)',
      400,
      'INVALID_PARAMETER'
    );
  }

  if (filterParams.toDate && !isValidDateString(filterParams.toDate)) {
    throw new AppError(
      'Invalid toDate format. Use ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)',
      400,
      'INVALID_PARAMETER'
    );
  }

  return filterParams;
};

/**
 * Extract and validate pagination options from request
 */
export const extractPaginationOptions = (req: Request): FilterOptions => {
  const rawLimit = req.query.limit as string | undefined;
  const rawOffset = req.query.offset as string | undefined;
  const rawSortBy = req.query.sortBy as string | undefined;
  const rawSortDirection = req.query.sortDirection as string | undefined;

  const limit = rawLimit !== undefined ? parseInt(rawLimit, 10) : 10;
  const offset = rawOffset !== undefined ? parseInt(rawOffset, 10) : 0;
  const sortBy = rawSortBy ?? 'date';
  const sortDirection = (rawSortDirection === 'asc' || rawSortDirection === 'desc') ? rawSortDirection : 'desc';

  if (isNaN(limit) || limit < 1 || limit > 100) {
    throw new AppError('Limit must be a number between 1 and 100', 400, 'INVALID_PARAMETER');
  }

  if (isNaN(offset) || offset < 0) {
    throw new AppError('Offset must be a non-negative number', 400, 'INVALID_PARAMETER');
  }

  const allowedSortFields = ['date', 'patientName', 'type', 'createdAt', 'updatedAt'];
  const sanitizedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'date';

  return {
    limit,
    offset,
    sortBy: sanitizedSortBy,
    sortDirection,
  };
};

/**
 * Sanitize string input to prevent injection attacks
 */
export const sanitizeString = (input: string): string => {
  // Basic sanitization - replace potentially harmful characters
  return input
    .trim()
    .replace(/[<>]/g, ''); // Remove angle brackets to prevent HTML injection
};

/**
 * Check if a string is a valid date in ISO format
 */
export const isValidDateString = (dateString: string): boolean => {
  // First, try parsing as ISO format
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  if (isoDateRegex.test(dateString)) {
    return !isNaN(Date.parse(dateString));
  }

  // Also accept YYYY-MM-DD format
  const simpleDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (simpleDateRegex.test(dateString)) {
    return !isNaN(Date.parse(dateString));
  }

  return false;
};
