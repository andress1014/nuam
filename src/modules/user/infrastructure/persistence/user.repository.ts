import { UserModel } from "../../../../models";
import { User } from "../../domain/entities/user";
import { IUserRepository } from "../../domain/repositories/Iuser.repository";
import bcrypt from 'bcrypt';

export class UserRepository implements IUserRepository {  async save(user: User): Promise<User> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      // Create user in database
      const createdUser = await UserModel.create({
        name: user.name,
        email: user.email,
        password: hashedPassword
      });

      // Map DB entity to domain entity
      return User.create({
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        password: createdUser.password,
        createdAt: createdUser.createdAt,
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
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  }  async findByEmail(email: string): Promise<User | null> {
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
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.createdAt // Use createdAt as a fallback for updatedAt
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
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  }
  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    
    if (!user) return null;
    
    // If password is being updated, hash it
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    
    await user.update(userData);
    
    return User.create({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
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
