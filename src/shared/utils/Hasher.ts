import bcrypt from 'bcrypt';

export class Hasher {
  /**
   * Hash a password with bcrypt
   * @param password Plain text password to hash
   * @returns Hashed password
   */
  static async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare a plain text password with a hash
   * @param password Plain text password
   * @param hash Hashed password to compare against
   * @returns True if the password matches the hash
   */
  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
