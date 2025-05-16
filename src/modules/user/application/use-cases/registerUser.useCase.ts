import { User } from "../../domain/entities/user";
import { IUserRepository } from "../../domain/repositories/Iuser.repository";
import { RegisterUserDto } from "../dto/registerUser.dto";

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}  async execute(userData: RegisterUserDto): Promise<User> {

    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      console.error('User with this email already exists');
      throw new Error('User with this email already exists');
    }
    
    // Crear directamente el objeto User y guardarlo con el repositorio
    const userToSave = new User(
      '', // id vacío para nueva creación
      userData.name,
      userData.email,
      userData.password, // Password will be hashed in the repository layer
      undefined,
      undefined
    );
    
    // Save and return the new user
    return await this.userRepository.save(userToSave);
  }
}
