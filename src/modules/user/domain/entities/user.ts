// User domain entity - represents a user in the system
export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static create(props: {
    id?: string;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): User {
    return new User(
      props.id || '',
      props.name,
      props.email,
      props.password,
      props.createdAt,
      props.updatedAt
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
