import { BaseAttributes, BaseCreationAttributes } from '../base.interface';

// User attributes interface
export interface UserAttributes extends BaseAttributes {
  name: string;
  email: string;
  password_hash: string;
  created_at?: Date;
}

// User creation attributes (password is required during creation, id can be omitted)
export interface UserCreationAttributes extends BaseCreationAttributes<UserAttributes> {}

// Exported type for use in other models
export type User = UserAttributes;
