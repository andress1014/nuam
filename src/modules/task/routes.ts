import { Router } from 'express';
import { TaskControllers } from './controller/task.controller';
import { AuthMiddleware } from '../../shared/middlewares/AuthMiddleware';
import { JwtService } from '../user/services/auth/jwt.service';

const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

// Create router for task routes
export const TaskRouter = Router();

// All task routes require authentication
TaskRouter.use(authMiddleware.authenticate);

// Register controller routes
TaskRouter.use('/', TaskControllers);

// Export routes as a module
export { TaskRouter as TaskRoutes };
