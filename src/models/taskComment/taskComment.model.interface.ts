import { BaseAttributes, BaseCreationAttributes } from '../base.interface';
import { Task } from '../task/task.model.interface';
import { User } from '../user/user.model.interface';

// Task Comment attributes interface
export interface TaskCommentAttributes extends BaseAttributes {
  taskId: string;
  userId: string;
  comment: string;
  createdAt?: Date;
}

// Task Comment creation attributes
export interface TaskCommentCreationAttributes extends BaseCreationAttributes<TaskCommentAttributes> {}

// Exported type for use in other models
export type TaskComment = TaskCommentAttributes & {
  task?: Task;
  user?: User;
};
