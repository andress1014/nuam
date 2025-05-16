import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { handleResponse, HttpCode } from '../../../helpers';

export const validateShareProject = [
  body('userIds')
    .isArray({ min: 1 })
    .withMessage('At least one user ID must be provided')
    .custom(userIds => userIds.every((id: any) => typeof id === 'string' && id.trim() !== ''))
    .withMessage('All user IDs must be valid strings'),
  
  body('role')
    .isString()
    .withMessage('Role must be a string')
    .isIn(['owner', 'editor', 'viewer'])
    .withMessage('Role must be one of: owner, editor, viewer'),
  
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
