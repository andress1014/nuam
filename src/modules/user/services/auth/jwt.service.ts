import jwt from 'jsonwebtoken';

export class JwtService {
  private readonly secretKey: string;

  constructor() {
    // Use a fixed secret key for development to ensure consistency
    // In production, this should come from environment variables
    this.secretKey = 'nuam-technical-test-secret-2025';
    console.log('JWT Secret configured with fixed value for development');
  }

  createToken(payload: any): string {
    return jwt.sign({ user: payload }, this.secretKey, { expiresIn: '1d' });
  }

  verifyToken(token: string): any {
    if (token.includes("Bearer")) {
      token = token.split(" ")[1];
    }
    
    try {
      const decoded = jwt.verify(token, this.secretKey);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
