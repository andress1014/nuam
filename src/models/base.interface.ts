import { Optional } from 'sequelize';

// Base attributes for all models (with UUID and timestamps)
export interface BaseAttributes {
  id: string; // UUID
  createdAt?: Date;
  updatedAt?: Date;
}

// Define a type for creation attributes - allows omission of id and timestamps during creation
export type BaseCreationAttributes<T extends BaseAttributes> = Optional<T, 'id' | 'createdAt' | 'updatedAt'>;
