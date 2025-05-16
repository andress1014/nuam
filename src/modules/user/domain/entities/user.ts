// User domain entity - represents a user in the system
export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password_hash: string,
    public role: 'admin' | 'user' = 'user',
    public created_at?: Date,
    public updatedAt?: Date
  ) {}

  static create(props: {
    id?: string;
    name: string;
    email: string;
    password_hash: string;
    role?: 'admin' | 'user';
    created_at?: Date;
    updatedAt?: Date;
  }): User {    return new User(
      props.id || '',
      props.name,
      props.email,
      props.password_hash,
      props.role || 'user',
      props.created_at,
      props.updatedAt
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      created_at: this.created_at,
      updatedAt: this.updatedAt
    };
  }
}
