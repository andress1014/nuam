import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { handleResponse, HttpCode } from '../../../helpers';

export const validateAssignTasks = [
  param('projectId')
    .isUUID()
    .withMessage('Project ID must be a valid UUID'),
  
  body('assignments')
    .isArray({ min: 1 })
    .withMessage('At least one assignment must be provided'),
  
  body('assignments.*.taskId')
    .isUUID()
    .withMessage('Task ID must be a valid UUID'),
  
  body('assignments.*.userId')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return handleResponse(res, HttpCode.BAD_REQUEST, {
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    next();
  }
];
