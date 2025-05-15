import { BaseAttributes, BaseCreationAttributes } from '../base.interface';
import { User } from '../user/user.model.interface';

// Project attributes interface
export interface ProjectAttributes extends BaseAttributes {
  name: string;
  description?: string | null;
  createdBy: string; // UUID of the user who created the project
  createdAt?: Date;
}

// Project creation attributes
export interface ProjectCreationAttributes extends BaseCreationAttributes<ProjectAttributes> {}

// Exported type for use in other models
export type Project = ProjectAttributes & {
  creator?: User; // For eager loading the creator
};
