import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../modules/user/services/auth/jwt.service';

export class AuthMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get the token from the Authorization header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Authentication failed: No token provided'
        });
      }

      try {
        // Verify the token
        const decoded = this.jwtService.verifyToken(authHeader);
        
        // Add the user info to the request
        req.user = decoded.user;
        
        // Continue to the next middleware or controller
        next();
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Authentication failed: Invalid token'
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
}

// Add user type to Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
