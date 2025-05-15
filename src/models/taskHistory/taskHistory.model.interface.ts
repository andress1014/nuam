import { BaseAttributes, BaseCreationAttributes } from '../base.interface';
import { Task } from '../task/task.model.interface';
import { User } from '../user/user.model.interface';

// Task History attributes interface
export interface TaskHistoryAttributes extends BaseAttributes {
  taskId: string;
  changedBy: string;
  changeType: string;
  oldValue?: string | null;
  newValue?: string | null;
  changedAt?: Date;
}

// Task History creation attributes
export interface TaskHistoryCreationAttributes extends BaseCreationAttributes<TaskHistoryAttributes> {}

// Exported type for use in other models
export type TaskHistory = TaskHistoryAttributes & {
  task?: Task;
  user?: User;
};
