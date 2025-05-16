import { Router } from 'express';
import { UserControllers } from './controller/user.controller';
import { validateLogin } from './validator/loginUser.validator';
import { validateRegister } from './validator/registerUser.validator';
import { validateProfile } from './validator/profileUser.validator';
import { AuthMiddleware } from '../../shared/middlewares/AuthMiddleware';
import { JwtService } from './services/auth/jwt.service';

// Create instances
const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

export const UserRouter = Router();

// Apply validators to the router
UserRouter.use('/register', validateRegister);
UserRouter.use('/login', validateLogin);
UserRouter.use('/profile', authMiddleware.authenticate, validateProfile);

// Mount the controller
UserRouter.use('/', UserControllers);

