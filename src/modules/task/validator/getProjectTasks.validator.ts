import { Request, Response, NextFunction } from 'express';
import { param, validationResult } from 'express-validator';
import { handleResponse, HttpCode } from '../../../helpers';

export const validateGetProjectTasks = [
  param('projectId')
    .notEmpty()
    .withMessage('Project ID is required')
    .isUUID()
    .withMessage('Project ID must be a valid UUID'),
  
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
