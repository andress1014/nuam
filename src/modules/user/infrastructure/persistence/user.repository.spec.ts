import { UserRepository } from './user.repository';
import { UserModel } from '../../../../models';
import { User } from '../../domain/entities/user';
import bcrypt from 'bcrypt';
import { describe, expect, it, jest, beforeEach } from "@jest/globals";

// Mock Models
jest.mock('../../../../models', () => ({
  UserModel: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  }
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn()
}));

// Type for mock user
type MockUser = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: Date;
  updatedAt: Date;
  update: jest.Mock;
  destroy: jest.Mock;
};

const mockUser: MockUser = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  password_hash: 'hashedpassword',
  role: 'user',
  created_at: new Date(),
  updatedAt: new Date(),
  update: jest.fn(),
  destroy: jest.fn()
};

// Mock User.create static method
jest.spyOn(User, 'create').mockImplementation((data: any) => data as User);

describe('UserRepository', () => {
  const repository = new UserRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save a user', async () => {
    (UserModel.create as jest.Mock<any>).mockResolvedValue(mockUser);

    const user = await repository.save({
      name: mockUser.name,
      email: mockUser.email,
      password_hash: mockUser.password_hash
    } as unknown as User);

    expect(UserModel.create).toHaveBeenCalled();
    expect(user.email).toBe(mockUser.email);
  });

  it('should find user by ID', async () => {
    (UserModel.findByPk as jest.Mock<any>).mockResolvedValue(mockUser);

    const result = await repository.findById('123');

    expect(UserModel.findByPk).toHaveBeenCalledWith('123');
    expect(result?.id).toBe('123');
  });

  it('should return null if user not found by ID', async () => {
    (UserModel.findByPk as jest.Mock<any>).mockResolvedValue(null);

    const result = await repository.findById('not_found');

    expect(result).toBeNull();
  });

  it('should find user by email', async () => {
    (UserModel.findOne as jest.Mock<any>).mockResolvedValue(mockUser);

    const result = await repository.findByEmail('john@example.com');

    expect(UserModel.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
    expect(result?.email).toBe(mockUser.email);
  });

  it('should return null if user not found by email', async () => {
    (UserModel.findOne as jest.Mock<any>).mockResolvedValue(null);

    const result = await repository.findByEmail('not_found@example.com');

    expect(result).toBeNull();
  });

  it('should return all users', async () => {
    (UserModel.findAll as jest.Mock<any>).mockResolvedValue([mockUser]);

    const result = await repository.findAll();

    expect(UserModel.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('123');
  });  it('should update user and hash password', async () => {
    (UserModel.findByPk as jest.Mock<any>).mockResolvedValue(mockUser);
    (bcrypt.genSalt as jest.Mock).mockImplementation(() => Promise.resolve('salt'));
    (bcrypt.hash as jest.Mock).mockImplementation(() => Promise.resolve('newhashedpassword'));

    const result = await repository.update('123', {
      password_hash: 'newpassword'
    } as unknown as Partial<User>);

    expect(bcrypt.hash).toHaveBeenCalled();
    expect(mockUser.update).toHaveBeenCalledWith({
      password_hash: 'newhashedpassword'
    });
    expect(result?.password_hash).toBe(mockUser.password_hash);
  });

  it('should return null if updating non-existent user', async () => {
    (UserModel.findByPk as jest.Mock<any>).mockResolvedValue(null);

    const result = await repository.update('invalid-id', { name: 'Test' } as unknown as Partial<User>);

    expect(result).toBeNull();
  });

  it('should delete a user', async () => {
    (UserModel.findByPk as jest.Mock<any>).mockResolvedValue(mockUser);

    const result = await repository.delete('123');

    expect(mockUser.destroy).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return false when deleting a non-existent user', async () => {
    (UserModel.findByPk as jest.Mock<any>).mockResolvedValue(null);

    const result = await repository.delete('not-found');

    expect(result).toBe(false);
  });
});
