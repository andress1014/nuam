import { Router } from 'express';
import { UserControllers } from './controller/user.controller';

export const UserRouter = Router();
UserRouter.use(UserControllers)

