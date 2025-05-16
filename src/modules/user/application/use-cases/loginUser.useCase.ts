import { IUserRepository } from "../../domain/repositories/Iuser.repository";
import { LoginUserDto } from "../dto/loginUser.dto";
import bcrypt from 'bcrypt';

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: any
  ) {}

  async execute(credentials: LoginUserDto): Promise<{ token: string; userId: string }> {
    // Find user by email
    const user = await this.userRepository.findByEmail(credentials.email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = this.jwtService.createToken({
      id: user.id,
      email: user.email,
      name: user.name
    });

    return {
      token,
      userId: user.id
    };
  }
}
