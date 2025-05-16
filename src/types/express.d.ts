// Add custom properties to Express Request object
import { User } from "../modules/user/domain/entities/user";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
