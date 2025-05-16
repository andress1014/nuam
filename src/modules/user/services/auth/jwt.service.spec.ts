import { JwtService } from './jwt.service';
import jwt from 'jsonwebtoken';
import { describe, expect, it, jest } from "@jest/globals";

// Mock jsonwebtoken module
jest.mock('jsonwebtoken');

describe('JwtService', () => {
  let jwtService: JwtService;
  
  beforeEach(() => {
    jest.resetAllMocks();
    jwtService = new JwtService();
    
    // Access the private secretKey for testing purposes
    // @ts-ignore - Accessing private property for testing
    expect(jwtService.secretKey).toBe('nuam-technical-test-secret-2025');
  });

  describe('createToken', () => {
    it('should create a JWT token with the correct parameters', () => {
      // Arrange
      const payload = { id: '123', name: 'John Doe', email: 'john@example.com' };
      const expectedToken = 'jwt-token';
      
      // Mock jwt.sign to return a fixed token
      (jwt.sign as jest.Mock).mockReturnValue(expectedToken);

      // Act
      const token = jwtService.createToken(payload);

      // Assert
      expect(token).toBe(expectedToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        { user: payload },
        'nuam-technical-test-secret-2025',
        { expiresIn: '1d' }
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify a token and return the decoded payload', () => {
      // Arrange
      const token = 'jwt-token';
      const decodedPayload = { user: { id: '123', name: 'John Doe' } };
      
      // Mock jwt.verify to return a fixed decoded payload
      (jwt.verify as jest.Mock).mockReturnValue(decodedPayload);

      // Act
      const result = jwtService.verifyToken(token);

      // Assert
      expect(result).toBe(decodedPayload);
      expect(jwt.verify).toHaveBeenCalledWith(token, 'nuam-technical-test-secret-2025');
    });

    it('should remove "Bearer " prefix if present in the token', () => {
      // Arrange
      const token = 'Bearer jwt-token';
      const decodedPayload = { user: { id: '123', name: 'John Doe' } };
      
      // Mock jwt.verify to return a fixed decoded payload
      (jwt.verify as jest.Mock).mockReturnValue(decodedPayload);

      // Act
      const result = jwtService.verifyToken(token);

      // Assert
      expect(result).toBe(decodedPayload);
      expect(jwt.verify).toHaveBeenCalledWith('jwt-token', 'nuam-technical-test-secret-2025');
    });

    it('should throw an error when token verification fails', () => {
      // Arrange
      const token = 'invalid-token';
      const verifyError = new Error('Token expired');
      
      // Mock jwt.verify to throw an error
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw verifyError;
      });

      // Act & Assert
      expect(() => jwtService.verifyToken(token)).toThrow('Invalid token');
      expect(jwt.verify).toHaveBeenCalledWith(token, 'nuam-technical-test-secret-2025');
    });
  });
});
