import { RegisterUserDto } from './registerUser.dto';
import { describe, expect, it, jest } from "@jest/globals";

describe('RegisterUserDto', () => {
  it('should create a RegisterUserDto with all properties', () => {
    // Arrange
    const name = 'John Doe';
    const email = 'john@example.com';
    const password = 'password123';

    // Act
    const registerUserDto = new RegisterUserDto(name, email, password);

    // Assert
    expect(registerUserDto.name).toBe(name);
    expect(registerUserDto.email).toBe(email);
    expect(registerUserDto.password).toBe(password);
  });
});
