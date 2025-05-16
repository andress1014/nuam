import { Request, Response, NextFunction } from 'express';
import { param, validationResult } from 'express-validator';
import { handleResponse, HttpCode } from '../../../helpers';

export const validateGetTaskHistory = [
  param('taskId')
    .notEmpty()
    .withMessage('Task ID is required')
    .isUUID()
    .withMessage('Task ID must be a valid UUID'),
  
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
