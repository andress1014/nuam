import { BaseAttributes, BaseCreationAttributes } from '../base.interface';
import { Project } from '../project/project.model.interface';

// Task status type
export type TaskStatus = 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled';

// Task attributes interface
export interface TaskAttributes extends BaseAttributes {
  projectId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate?: Date | null;
  createdAt?: Date;
}

// Task creation attributes
export interface TaskCreationAttributes extends BaseCreationAttributes<TaskAttributes> {}

// Exported type for use in other models
export type Task = TaskAttributes & {
  project?: Project;
};
