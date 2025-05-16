import { User } from './user';
import { describe, expect, it } from "@jest/globals";

describe('User Entity', () => {
  it('should create a user with all properties', () => {
    // Arrange
    const id = '123';
    const name = 'John Doe';
    const email = 'john@example.com';
    const password_hash = 'hashed_password';
    const role = 'admin';
    const created_at = new Date();
    const updatedAt = new Date();

    // Act
    const user = new User(
      id,
      name,
      email,
      password_hash,
      role,
      created_at,
      updatedAt
    );

    // Assert
    expect(user.id).toBe(id);
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
    expect(user.password_hash).toBe(password_hash);
    expect(user.role).toBe(role);
    expect(user.created_at).toBe(created_at);
    expect(user.updatedAt).toBe(updatedAt);
  });

  it('should create a user with default role as user', () => {
    // Arrange & Act
    const user = new User(
      '123',
      'John Doe',
      'john@example.com',
      'hashed_password'
    );

    // Assert
    expect(user.role).toBe('user');
  });

  it('should create a user using the static create method', () => {
    // Arrange
    const userData = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: 'hashed_password',
      role: 'admin' as 'admin' | 'user',
      created_at: new Date(),
      updatedAt: new Date()
    };

    // Act
    const user = User.create(userData);

    // Assert
    expect(user.id).toBe(userData.id);
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password_hash).toBe(userData.password_hash);
    expect(user.role).toBe(userData.role);
    expect(user.created_at).toBe(userData.created_at);
    expect(user.updatedAt).toBe(userData.updatedAt);
  });

  it('should generate default id and role when not provided in create method', () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: 'hashed_password'
    };

    // Act
    const user = User.create(userData);

    // Assert
    expect(user.id).toBe('');
    expect(user.role).toBe('user');
  });

  it('should return a JSON representation without password_hash', () => {
    // Arrange
    const user = new User(
      '123',
      'John Doe',
      'john@example.com',
      'hashed_password',
      'user',
      new Date('2023-01-01'),
      new Date('2023-01-02')
    );

    // Act
    const userJson = user.toJSON();

    // Assert
    expect(userJson).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      created_at: user.created_at,
      updatedAt: user.updatedAt
    });
    expect('password_hash' in userJson).toBe(false);
  });
});
