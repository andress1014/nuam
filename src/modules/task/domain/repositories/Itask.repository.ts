import { Task } from "../entities/task";
import { TaskComment } from "../entities/taskComment";
import { TaskHistory } from "../entities/taskHistory";
import { TaskAssignment } from "../entities/taskAssignment";
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
  
  // Task assignment operations
  assignTask(assignment: TaskAssignment, transaction?: Transaction): Promise<TaskAssignment>;
  assignTasks(assignments: TaskAssignment[], transaction?: Transaction): Promise<TaskAssignment[]>;
  getTaskAssignments(taskId: string): Promise<TaskAssignment[]>;
  removeTaskAssignment(taskId: string, userId: string, transaction?: Transaction): Promise<boolean>;
  findTaskAssignment(taskId: string, userId: string): Promise<TaskAssignment | null>;
  
  // Transaction management
  getTransaction(): Promise<Transaction>;
  commitTransaction(transaction: Transaction): Promise<void>;
  rollbackTransaction(transaction: Transaction): Promise<void>;
}
