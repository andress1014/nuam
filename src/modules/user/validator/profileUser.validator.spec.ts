import { validateProfile } from './profileUser.validator';
import { Request, Response, NextFunction } from 'express';
import { handleValidator } from '../../../helpers';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock helpers
jest.mock('../../../helpers', () => ({
  handleValidator: jest.fn(),
  HttpCode: {
    BAD_REQUEST: 400
  }
}));

describe('Profile User Validator', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockRequest = {
      user: { id: '123' }
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any
    };
    
    mockNext = jest.fn() as unknown as jest.MockedFunction<NextFunction>;
  });

  it('should contain a handler middleware function', () => {
    // Check if the validator has the expected number of middleware functions
    // (1 handler function)
    expect(validateProfile).toHaveLength(1);
  });

  it('should call handleValidator in the middleware function', () => {
    // Get the middleware function
    const handlerMiddleware = validateProfile[0];
    
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
