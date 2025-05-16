import { Router } from 'express';
import { ProjectControllers } from './controller/project.controller';
import { AuthMiddleware } from '../../shared/middlewares/AuthMiddleware';
import { JwtService } from '../user/services/auth/jwt.service';

const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

// Creamos un router para las rutas de proyectos
export const ProjectRouter = Router();

// Todas las rutas de proyectos requieren autenticación
ProjectRouter.use(authMiddleware.authenticate);

// Registramos las rutas del controlador
ProjectRouter.use('/', ProjectControllers);

// Exportamos las rutas como un módulo
export { ProjectRouter as ProjectRoutes };
