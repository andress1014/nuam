// filepath: c:\Users\andre\OneDrive\Escritorio\Andres\Trabajos y proyectos\nuam-tecnical\src\modules\user\controller\user.controller.ts
import { Request, Response, Router } from 'express';
//***************** use-cases **************//
import { RegisterUserUseCase } from '../application/use-cases/registerUser.useCase';
import { LoginUserUseCase } from '../application/use-cases/loginUser.useCase';
import { GetUserProfileUseCase } from '../application/use-cases/getUserProfile.useCase';
//***************** DTOs **************//
import { RegisterUserDto } from '../application/dto/registerUser.dto';
import { LoginUserDto } from '../application/dto/loginUser.dto';
//***************** services **************//
import { JwtService } from '../services/auth/jwt.service';
import { UserRepository } from '../infrastructure/persistence/user.repository';
import { handleResponse } from '../../../helpers';
import { AuthMiddleware } from '../../../shared/middlewares/AuthMiddleware';

// Instancia de servicios necesarios
const userRepository = new UserRepository();
const jwtService = new JwtService(); // No se requiere JWT_SECRET como parámetro
const authMiddleware = new AuthMiddleware(jwtService);

// Instancia de casos de uso
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository, jwtService);
const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);

export const UserControllers = Router();

/**
 * Register a new user
 */
UserControllers.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const registerDto = new RegisterUserDto(name, email, password);
  const user = await registerUserUseCase.execute(registerDto);

  handleResponse(res, 201, user);
});

/**
 * Login a user
 */
UserControllers.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const loginDto = new LoginUserDto(email, password);
    const loginResponse = await loginUserUseCase.execute(loginDto);

    handleResponse(res, 200, loginResponse);
  } catch (error) {
    console.error("Error in login controller:", error);
    if (error instanceof Error) {
      if (error.message === 'Invalid credentials') {
        handleResponse(res, 401, { message: "Invalid email or password" });
      } else {
        handleResponse(res, 500, { message: "An error occurred during login" });
      }
    } else {
      handleResponse(res, 500, { message: "An unknown error occurred" });
    }
  }
});

/**
 * Get user profile
 */
UserControllers.get("/profile", authMiddleware.authenticate, async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const userProfile = await getUserProfileUseCase.execute(userId);

  handleResponse(res, 200, userProfile);
});
