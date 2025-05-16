import { UserModel } from "../../../../models";
import { User } from "../../domain/entities/user";
import { IUserRepository } from "../../domain/repositories/Iuser.repository";
import bcrypt from 'bcrypt';

export class UserRepository implements IUserRepository {
  async save(user: User): Promise<User> {
    try {

      // Create user in database
      const createdUser = await UserModel.create({
        name: user.name,
        email: user.email,
        password_hash: user.password_hash
      });

      // Map DB entity to domain entity
      return User.create({
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        password_hash: createdUser.password_hash,
        created_at: createdUser.created_at,
        updatedAt: createdUser.updatedAt
      });
    } catch (error) {
      console.error("Error in save:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    
    if (!user) return null;
    
    return User.create({
      id: user.id,
      name: user.name,
      email: user.email,
      password_hash: user.password_hash,
      created_at: user.created_at,
      updatedAt: user.updatedAt
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      // Use attributes to avoid field mapping issues
      const user = await UserModel.findOne({ 
        where: { email }
      });
      if (!user) return null;
        return User.create({
        id: user.id,
        name: user.name,
        email: user.email,
        password_hash: user.password_hash,
        created_at: user.created_at,
        updatedAt: user.updatedAt
      });
    } catch (error) {
      console.error("Error in findByEmail:", error);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    const users = await UserModel.findAll();
    
    return users.map(user => User.create({
      id: user.id,
      name: user.name,
      email: user.email,
      password_hash: user.password_hash,
      created_at: user.created_at,
      updatedAt: user.updatedAt
    }));
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    
    if (!user) return null;
    
    // If password_hash is being updated, hash it
    if (userData.password_hash) {
      const salt = await bcrypt.genSalt(10);
      userData.password_hash = await bcrypt.hash(userData.password_hash, salt);
    }
    
    await user.update(userData);
    
    return User.create({
      id: user.id,
      name: user.name,
      email: user.email,
      password_hash: user.password_hash,
      created_at: user.created_at,
      updatedAt: user.updatedAt
    });
  }

  async delete(id: string): Promise<boolean> {
    const user = await UserModel.findByPk(id);
    
    if (!user) return false;
    
    await user.destroy();
    return true;
  }
}
