import { GetUserProfileUseCase } from './getUserProfile.useCase';
import { User } from '../../domain/entities/user';
import { IUserRepository } from '../../domain/repositories/Iuser.repository';
import { UserProfileDto } from '../dto/userProfile.dto';
import { HttpCode } from '../../../../helpers';
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

describe('GetUserProfileUseCase', () => {
  let getUserProfileUseCase: GetUserProfileUseCase;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
    getUserProfileUseCase = new GetUserProfileUseCase(mockUserRepository);
  });

  it('should get user profile successfully', async () => {
    // Arrange
    const userId = '123';
    const user = new User(
      userId,
      'John Doe',
      'john@example.com',
      'hashed_password',
      'user',
      new Date('2025-01-01'),
      new Date('2025-01-02')
    );

    // Mock repository behavior
    mockUserRepository.findById.mockResolvedValue(user);

    // Act
    const result = await getUserProfileUseCase.execute(userId);

    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(result).toBeInstanceOf(UserProfileDto);
    expect(result.id).toBe(user.id);
    expect(result.name).toBe(user.name);
    expect(result.email).toBe(user.email);
    expect(result.created_at).toBe(user.created_at);
    expect(result.updatedAt).toBe(user.updatedAt);
  });

  it('should throw an error when user is not found', async () => {
    // Arrange
    const userId = 'nonexistent';

    // Mock repository behavior
    mockUserRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(getUserProfileUseCase.execute(userId))
      .rejects
      .toEqual(expect.objectContaining({
        status: HttpCode.NOT_FOUND,
        message: 'User not found'
      }));
    
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
  });

  it('should propagate unexpected errors from the repository', async () => {
    // Arrange
    const userId = '123';
    const error = new Error('Database connection error');
    
    // Mock repository behavior
    mockUserRepository.findById.mockRejectedValue(error);

    // Act & Assert
    await expect(getUserProfileUseCase.execute(userId))
      .rejects
      .toThrow('Database connection error');
    
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
  });
});
