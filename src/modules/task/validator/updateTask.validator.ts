import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { handleResponse, HttpCode } from '../../../helpers';

export const validateUpdateTask = [
  param('id')
    .notEmpty()
    .withMessage('Task ID is required')
    .isUUID()
    .withMessage('Task ID must be a valid UUID'),
  
  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 150 })
    .withMessage('Title must be at most 150 characters long'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'review', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, in_progress, review, completed, cancelled'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  
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
