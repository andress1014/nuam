import { AppError, HttpCode } from "../../../../helpers";
import { IUserRepository } from "../../domain/repositories/Iuser.repository";
import { LoginUserDto } from "../dto/loginUser.dto";
import bcrypt from 'bcrypt';

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: any
  ) {}
  async execute(credentials: LoginUserDto): Promise<{ token: string; userId: string }> {
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(credentials.email);
        if (!user) {
        throw new AppError({
          status: HttpCode.UNAUTHORIZED,
          message: 'Invalid credentials'
        });
      }      // Verify password
      const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash);
      if (!isPasswordValid) {
        throw new AppError({
          status: HttpCode.UNAUTHORIZED,
          message: 'Invalid credentials'
        });
      }

    // Generate JWT token
    const token = this.jwtService.createToken({
      id: user.id,
      email: user.email,
      name: user.name
    });    return {
      token,
      userId: user.id
    };    } catch (error) {
      console.error("Login error:", error);
      
      // Si ya es un AppError, solo lo lanzamos
      if (error instanceof AppError) {
        throw error;
      }
      
      // Si es otro tipo de error, lo convertimos a AppError
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error during login process',
        detailsError: error
      });
    }
  }
}
