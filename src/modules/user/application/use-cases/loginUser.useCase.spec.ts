import { LoginUserUseCase } from './loginUser.useCase';
import { LoginUserDto } from '../dto/loginUser.dto';
import { User } from '../../domain/entities/user';
import { IUserRepository } from '../../domain/repositories/Iuser.repository';
import { AppError, HttpCode } from '../../../../helpers';
import bcrypt from 'bcrypt';
import { describe, expect, it, jest, beforeEach } from "@jest/globals";

// Mock bcrypt for testing
jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));

// Create a mock implementation of IUserRepository
const mockUserRepository: jest.Mocked<IUserRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

// Create a mock implementation of JwtService
const mockJwtService = {
  createToken: jest.fn(),
  verifyToken: jest.fn()
};

describe('LoginUserUseCase', () => {
  let loginUserUseCase: LoginUserUseCase;  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
    loginUserUseCase = new LoginUserUseCase(mockUserRepository, mockJwtService);

    // Mock bcrypt.compare to return true by default
    (bcrypt.compare as jest.Mock).mockImplementation(() => Promise.resolve(true));
  });

  it('should login a user successfully with valid credentials', async () => {
    // Arrange
    const loginDto: LoginUserDto = {
      email: 'john@example.com',
      password: 'password123'
    };

    const user = new User(
      '123',
      'John Doe',
      'john@example.com',
      'hashed_password',
      'user',
      new Date(),
      new Date()
    );

    const token = 'jwt-token';

    // Mock repository and service behavior
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockJwtService.createToken.mockReturnValue(token);

    // Act
    const result = await loginUserUseCase.execute(loginDto);

    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, user.password_hash);
    expect(mockJwtService.createToken).toHaveBeenCalledWith({
      id: user.id,
      email: user.email,
      name: user.name
    });
    expect(result).toEqual({
      token,
      userId: user.id
    });
  });

  it('should throw an error when user with email does not exist', async () => {
    // Arrange
    const loginDto: LoginUserDto = {
      email: 'nonexistent@example.com',
      password: 'password123'
    };

    // Mock repository behavior
    mockUserRepository.findByEmail.mockResolvedValue(null);

    // Act & Assert
    await expect(loginUserUseCase.execute(loginDto))
      .rejects
      .toEqual(expect.objectContaining({
        status: HttpCode.UNAUTHORIZED,
        message: 'Invalid credentials'
      }));
    
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(mockJwtService.createToken).not.toHaveBeenCalled();
  });

  it('should throw an error when password is invalid', async () => {
    // Arrange
    const loginDto: LoginUserDto = {
      email: 'john@example.com',
      password: 'wrong_password'
    };

    const user = new User(
      '123',
      'John Doe',
      'john@example.com',
      'hashed_password',
      'user',
      new Date(),
      new Date()
    );    // Mock repository behavior
    mockUserRepository.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockImplementation(() => Promise.resolve(false));

    // Act & Assert
    await expect(loginUserUseCase.execute(loginDto))
      .rejects
      .toEqual(expect.objectContaining({
        status: HttpCode.UNAUTHORIZED,
        message: 'Invalid credentials'
      }));
    
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, user.password_hash);
    expect(mockJwtService.createToken).not.toHaveBeenCalled();
  });

  it('should propagate unexpected errors from the repository', async () => {
    // Arrange
    const loginDto: LoginUserDto = {
      email: 'john@example.com',
      password: 'password123'
    };

    const error = new Error('Database connection error');
    mockUserRepository.findByEmail.mockRejectedValue(error);

    // Act & Assert
    await expect(loginUserUseCase.execute(loginDto))
      .rejects
      .toEqual(expect.objectContaining({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error during login process',
        detailsError: error
      }));
  });
});
