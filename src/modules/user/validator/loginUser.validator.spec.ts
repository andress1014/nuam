import { validateLogin } from './loginUser.validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { handleValidator } from '../../../helpers';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock express-validator
jest.mock('express-validator', () => ({
  check: jest.fn().mockImplementation(() => ({
    notEmpty: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    isEmail: jest.fn().mockReturnThis()
  })),
  validationResult: jest.fn()
}));

// Mock helpers
jest.mock('../../../helpers', () => ({
  handleValidator: jest.fn(),
  HttpCode: {
    BAD_REQUEST: 400
  }
}));

describe('Login User Validator', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockRequest = {
      body: {
        email: 'john@example.com',
        password: 'password123'
      }
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any
    };
    
    mockNext = jest.fn() as unknown as jest.MockedFunction<NextFunction>;
  });

  it('should contain validation rules for email and password', () => {
    // Check if the validator has the expected number of middleware functions
    // (2 validation rules + 1 handler function)
    expect(validateLogin).toHaveLength(3);
  });

  it('should call handleValidator in the last middleware function', () => {
    // Get the last middleware function (handler)
    const handlerMiddleware = validateLogin[validateLogin.length - 1];
    
    // Execute the middleware with our mock objects
    handlerMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
    
    // Verify that handleValidator was called with the correct arguments
    expect(handleValidator).toHaveBeenCalledWith(
      mockRequest, 
      mockResponse, 
      mockNext
    );
  });
});
