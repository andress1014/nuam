import { User } from "../../domain/entities/user";
import { IUserRepository } from "../../domain/repositories/Iuser.repository";
import { RegisterUserDto } from "../dto/registerUser.dto";

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userData: RegisterUserDto): Promise<User> {

    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create a new user entity
    const user = User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password, // Password will be hashed in the repository layer
    });
    
    // Save and return the new user
    return await this.userRepository.save(user);
  }
}
