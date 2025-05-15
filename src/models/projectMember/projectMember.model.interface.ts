import { BaseAttributes, BaseCreationAttributes } from '../base.interface';
import { Project } from '../project/project.model.interface';
import { User } from '../user/user.model.interface';

export type MemberRole = 'owner' | 'editor' | 'viewer';

// Project Member attributes interface
export interface ProjectMemberAttributes extends BaseAttributes {
  projectId: string;
  userId: string;
  role: MemberRole;
  addedAt?: Date;
}

// Project Member creation attributes
export interface ProjectMemberCreationAttributes extends BaseCreationAttributes<ProjectMemberAttributes> {}

// Exported type for use in other models
export type ProjectMember = ProjectMemberAttributes & {
  project?: Project;
  user?: User;
};
