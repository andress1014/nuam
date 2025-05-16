import { UserControllers } from './user.controller';
import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../application/use-cases/registerUser.useCase';
import { LoginUserUseCase } from '../application/use-cases/loginUser.useCase';
import { GetUserProfileUseCase } from '../application/use-cases/getUserProfile.useCase';
import { handleResponse, HttpCode } from '../../../helpers';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { describe, expect, it, jest, beforeEach } from "@jest/globals";

// Mock all dependencies
jest.mock('../application/use-cases/registerUser.useCase', () => ({
  RegisterUserUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn()
  }))
}));
jest.mock('../application/use-cases/loginUser.useCase', () => ({
  LoginUserUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn()
  }))
}));
jest.mock('../application/use-cases/getUserProfile.useCase', () => ({
  GetUserProfileUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn()
  }))
}));
jest.mock('../../../helpers', () => ({
  handleResponse: jest.fn(),
  HttpCode: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  }
}));
jest.mock('../../../shared/utils/asyncHandler', () => ({
  asyncHandler: (fn: Function) => async (req: Request, res: Response) => {
    return await fn(req, res);
  }
}));

describe('User Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockRequest = {
      body: {},
      params: {},
      user: { id: '123' }
    };
      mockResponse = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any
    };
  });

  describe('Register endpoint', () => {
    it('should call RegisterUserUseCase.execute and return user data', async () => {
      // Find the register route handler
      const registerEndpoint = findEndpoint(UserControllers, '/register', 'post');
      expect(registerEndpoint).toBeDefined();
      
      // Setup request data and mock usecase
      const registerData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };
      mockRequest.body = registerData;      const mockCreatedUser = { id: '123', name: 'John Doe', email: 'john@example.com' };
      const mockExecute = jest.fn().mockResolvedValue(mockCreatedUser);
      
      // Mock the implementation of RegisterUserUseCase
      (RegisterUserUseCase as jest.Mock).mockImplementation(() => ({
        execute: mockExecute
      }));

      // Execute the endpoint handler
      await registerEndpoint(mockRequest as Request, mockResponse as Response);

      // Verify execution
      expect(mockExecute).toHaveBeenCalledWith(expect.objectContaining({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password
      }));
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse, 
        HttpCode.CREATED, 
        mockCreatedUser
      );
    });
  });

  describe('Login endpoint', () => {
    it('should call LoginUserUseCase.execute and return token', async () => {
      // Find the login route handler
      const loginEndpoint = findEndpoint(UserControllers, '/login', 'post');
      expect(loginEndpoint).toBeDefined();
      
      // Setup request data and mock usecase
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };
      mockRequest.body = loginData;
        const mockLoginResponse = { token: 'jwt-token', userId: '123' } as any;
      const mockExecute = jest.fn().mockResolvedValue(mockLoginResponse);
      
      // Mock the implementation of LoginUserUseCase
      (LoginUserUseCase as jest.Mock).mockImplementation(() => ({
        execute: mockExecute
      }));

      // Execute the endpoint handler
      await loginEndpoint(mockRequest as Request, mockResponse as Response);

      // Verify execution
      expect(mockExecute).toHaveBeenCalledWith(expect.objectContaining({
        email: loginData.email,
        password: loginData.password
      }));
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse, 
        HttpCode.OK, 
        mockLoginResponse
      );
    });
  });


});

// Helper function to find endpoint handler in Express router
function findEndpoint(router: any, path: string, method: string = 'get'): Function {
  // Find the stack in the router
  if (!router || !router.stack) {
    return jest.fn() as any;
  }
  
  // Find the layer with the matching route path
  const layer = router.stack.find((layer: any) => 
    layer.route && layer.route.path === path
  );
  
  if (!layer || !layer.route) {
    return jest.fn() as any;
  }
  
  // Find the handler with the matching method
  const handler = layer.route.stack.find((handler: any) => 
    handler.method === method
  );
  
  return handler ? handler.handle : jest.fn() as any;
}
