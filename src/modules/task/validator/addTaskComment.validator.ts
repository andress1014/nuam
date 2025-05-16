import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { handleResponse, HttpCode } from '../../../helpers';

export const validateAddTaskComment = [
  param('taskId')
    .notEmpty()
    .withMessage('Task ID is required')
    .isUUID()
    .withMessage('Task ID must be a valid UUID'),
  
  body('comment')
    .notEmpty()
    .withMessage('Comment is required')
    .isString()
    .withMessage('Comment must be a string'),
  
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
