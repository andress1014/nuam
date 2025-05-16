import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { handleResponse, HttpCode } from '../../../helpers';

export const validateCreateTask = [
  body('projectId')
    .notEmpty()
    .withMessage('Project ID is required')
    .isUUID()
    .withMessage('Project ID must be a valid UUID'),
  
  body('title')
    .notEmpty()
    .withMessage('Title is required')
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
