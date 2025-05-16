import { RegisterUserUseCase } from './registerUser.useCase';
import { RegisterUserDto } from '../dto/registerUser.dto';
import { User } from '../../domain/entities/user';
import { IUserRepository } from '../../domain/repositories/Iuser.repository';
import { describe, expect, it, jest, beforeEach } from "@jest/globals";

// Create a mock implementation of IUserRepository
const mockUserRepository: jest.Mocked<IUserRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
    registerUserUseCase = new RegisterUserUseCase(mockUserRepository);
  });

  it('should register a new user successfully', async () => {
    // Arrange
    const registerDto: RegisterUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    const savedUser = new User(
      '123',
      'John Doe',
      'john@example.com',
      'hashed_password',
      'user',
      new Date(),
      new Date()
    );

    // Mock repository behavior
    mockUserRepository.findByEmail.mockResolvedValue(null); // User does not exist
    mockUserRepository.save.mockResolvedValue(savedUser);

    // Act
    const result = await registerUserUseCase.execute(registerDto);

    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(registerDto.email);
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(result.id).toBe(savedUser.id);
    expect(result.name).toBe(savedUser.name);
    expect(result.email).toBe(savedUser.email);
    expect(result.role).toBe('user');

    // Verify the password in the passed object was not hashed yet (that should happen in repo)
    const savedObject = mockUserRepository.save.mock.calls[0][0];
    expect(savedObject.password_hash).toBe(registerDto.password);
  });

  it('should throw an error when user with email already exists', async () => {
    // Arrange
    const registerDto: RegisterUserDto = {
      name: 'John Doe',
      email: 'existing@example.com',
      password: 'password123'
    };

    const existingUser = new User(
      '123',
      'John Doe',
      'existing@example.com',
      'hashed_password',
      'user',
      new Date(),
      new Date()
    );

    // Mock repository behavior
    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    // Act & Assert
    await expect(registerUserUseCase.execute(registerDto))
      .rejects
      .toThrow('User with this email already exists');
    
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(registerDto.email);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should propagate unexpected errors from the repository', async () => {
    // Arrange
    const registerDto: RegisterUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    const error = new Error('Database connection error');
    mockUserRepository.findByEmail.mockRejectedValue(error);

    // Act & Assert
    await expect(registerUserUseCase.execute(registerDto))
      .rejects
      .toThrow('Database connection error');
  });
});
