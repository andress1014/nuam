import { LoginUserDto } from './loginUser.dto';
import { describe, expect, it, jest } from "@jest/globals";

describe('LoginUserDto', () => {
  it('should create a LoginUserDto with all properties', () => {
    // Arrange
    const email = 'john@example.com';
    const password = 'password123';

    // Act
    const loginUserDto = new LoginUserDto(email, password);

    // Assert
    expect(loginUserDto.email).toBe(email);
    expect(loginUserDto.password).toBe(password);
  });
});
