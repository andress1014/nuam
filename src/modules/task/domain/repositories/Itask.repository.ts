import { Task } from "../entities/task";
import { TaskComment } from "../entities/taskComment";
import { TaskHistory } from "../entities/taskHistory";
import { Transaction } from "sequelize";

// Repository interface that defines operations for task data management
export interface ITaskRepository {
  save(task: Task, transaction?: Transaction): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findByProjectId(projectId: string): Promise<Task[]>;
  update(id: string, taskData: Partial<Task>, userId: string, transaction?: Transaction): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
  
  // Task comment operations
  addComment(comment: TaskComment, transaction?: Transaction): Promise<TaskComment>;
  getCommentsByTaskId(taskId: string): Promise<TaskComment[]>;
  
  // Task history operations
  addHistory(history: TaskHistory, transaction?: Transaction): Promise<TaskHistory>;
  getHistoryByTaskId(taskId: string): Promise<TaskHistory[]>;
  
  // Transaction management
  getTransaction(): Promise<Transaction>;
  commitTransaction(transaction: Transaction): Promise<void>;
  rollbackTransaction(transaction: Transaction): Promise<void>;
}
