import jwt from 'jsonwebtoken';

export class JwtService {
  private readonly secretKey: string;

  constructor() {
    // Use process.env.JWT_SECRET if available, otherwise use a fallback for development
    this.secretKey = process.env.JWT_SECRET || 'default-development-secret-do-not-use-in-production';
    console.log(`JWT Secret is ${this.secretKey ? 'configured' : 'missing'}`);
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
