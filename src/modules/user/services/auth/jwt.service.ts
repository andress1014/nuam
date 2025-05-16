import jwt from 'jsonwebtoken';

export class JwtService {
  constructor(private readonly secretKey: string) {}

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
