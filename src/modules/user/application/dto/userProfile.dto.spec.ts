import { UserProfileDto } from './userProfile.dto';
import { User } from '../../domain/entities/user';
import { describe, expect, it, jest } from "@jest/globals";

describe('UserProfileDto', () => {
  it('should create a UserProfileDto with all properties', () => {
    // Arrange
    const id = '123';
    const name = 'John Doe';
    const email = 'john@example.com';
    const created_at = new Date('2025-01-01');
    const updatedAt = new Date('2025-01-02');

    // Act
    const userProfileDto = new UserProfileDto(
      id,
      name,
      email,
      created_at,
      updatedAt
    );

    // Assert
    expect(userProfileDto.id).toBe(id);
    expect(userProfileDto.name).toBe(name);
    expect(userProfileDto.email).toBe(email);
    expect(userProfileDto.created_at).toBe(created_at);
    expect(userProfileDto.updatedAt).toBe(updatedAt);
  });

  it('should create a UserProfileDto from a User entity', () => {
    // Arrange
    const user = new User(
      '123',
      'John Doe',
      'john@example.com',
      'hashed_password',
      'user',
      new Date('2025-01-01'),
      new Date('2025-01-02')
    );

    // Act
    const userProfileDto = UserProfileDto.fromEntity(user);

    // Assert
    expect(userProfileDto.id).toBe(user.id);
    expect(userProfileDto.name).toBe(user.name);
    expect(userProfileDto.email).toBe(user.email);
    expect(userProfileDto.created_at).toBe(user.created_at);
    expect(userProfileDto.updatedAt).toBe(user.updatedAt);
  });

  it('should create a UserProfileDto from any object with required properties', () => {
    // Arrange
    const userLike = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      created_at: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-02'),
      role: 'admin', // Extra property not included in UserProfileDto
      password_hash: 'hashed_password' // Extra property not included in UserProfileDto
    };

    // Act
    const userProfileDto = UserProfileDto.fromEntity(userLike);

    // Assert
    expect(userProfileDto.id).toBe(userLike.id);
    expect(userProfileDto.name).toBe(userLike.name);
    expect(userProfileDto.email).toBe(userLike.email);
    expect(userProfileDto.created_at).toBe(userLike.created_at);
    expect(userProfileDto.updatedAt).toBe(userLike.updatedAt);
    // @ts-ignore - Checking that the property doesn't exist
    expect(userProfileDto.role).toBeUndefined();
    // @ts-ignore - Checking that the property doesn't exist
    expect(userProfileDto.password_hash).toBeUndefined();
  });
});
