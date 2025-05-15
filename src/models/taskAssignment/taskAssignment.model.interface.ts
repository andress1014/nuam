import { BaseAttributes, BaseCreationAttributes } from '../base.interface';
import { Task } from '../task/task.model.interface';
import { User } from '../user/user.model.interface';

// Task Assignment attributes interface
export interface TaskAssignmentAttributes extends BaseAttributes {
  taskId: string;
  userId: string;
  assignedAt?: Date;
}

// Task Assignment creation attributes
export interface TaskAssignmentCreationAttributes extends BaseCreationAttributes<TaskAssignmentAttributes> {}

// Exported type for use in other models
export type TaskAssignment = TaskAssignmentAttributes & {
  task?: Task;
  user?: User;
};
