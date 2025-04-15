// backend/src/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

/**
 * Type for validation rules
 */
type ValidationRule = {
  field: string;
  location: 'body' | 'query' | 'params';
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
  custom?: (value: any) => boolean;
}

/**
 * Middleware factory to validate request data
 */
export const validateRequest = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    // Check each validation rule
    for (const rule of rules) {
      const { field, location, required = false } = rule;
      const source = req[location as keyof Request] as any;
      const value = source ? source[field] : undefined;

      // Check if required field is missing
      if (required && (value === undefined || value === null || value === '')) {
        errors.push(rule.message || `${field} is required`);
        continue;
      }

      // Skip further validation if value is not provided and not required
      if ((value === undefined || value === null) && !required) {
        continue;
      }

      // Type validation
      if (rule.type && typeof value !== rule.type) {
        // Special case for arrays
        if (rule.type === 'array' && !Array.isArray(value)) {
          errors.push(rule.message || `${field} must be an array`);
        } 
        // Normal type check
        else if (rule.type !== 'array') {
          errors.push(rule.message || `${field} must be a ${rule.type}`);
        }
      }

      // String validations
      if (typeof value === 'string') {
        // Min length check
        if (rule.minLength !== undefined && value.length < rule.minLength) {
          errors.push(rule.message || `${field} must be at least ${rule.minLength} characters`);
        }
        
        // Max length check
        if (rule.maxLength !== undefined && value.length > rule.maxLength) {
          errors.push(rule.message || `${field} cannot exceed ${rule.maxLength} characters`);
        }
        
        // Pattern check
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(rule.message || `${field} has an invalid format`);
        }
      }

      // Custom validation
      if (rule.custom && !rule.custom(value)) {
        errors.push(rule.message || `${field} validation failed`);
      }
    }

    // If there are validation errors, return 400 with all errors
    if (errors.length > 0) {
      return next(new AppError(errors.join(', '), 400, 'VALIDATION_ERROR'));
    }

    // No errors, proceed to next middleware/controller
    next();
  };
};

/**
 * Common validation rules that can be reused
 */
export const CommonValidations = {
  // ID validation (for route params)
  idParam: {
    field: 'id',
    location: 'params' as const,
    required: true,
    message: 'ID is required and must be valid'
  },
  
  // Patient name validation
  patientName: {
    field: 'patientName',
    location: 'body' as const,
    type: 'string' as const,
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Patient name is required and must be between 2 and 100 characters'
  },
  
  // Date validation (ISO format)
  date: {
    field: 'date',
    location: 'body' as const,
    type: 'string' as const,
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/,
    message: 'Date must be in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)'
  },
  
  // Summary validation
  summary: {
    field: 'summary',
    location: 'body' as const,
    type: 'string' as const,
    required: true,
    minLength: 10,
    maxLength: 2000,
    message: 'Summary is required and must be between 10 and 2000 characters'
  }
};