import { AppError, HttpCode } from "../../../../helpers";
import { TaskCommentModel, TaskHistoryModel, TaskModel, TaskAssignmentModel, UserModel } from "../../../../models";
import { Task } from "../../domain/entities/task";
import { TaskComment } from "../../domain/entities/taskComment";
import { TaskHistory } from "../../domain/entities/taskHistory";
import { TaskAssignment } from "../../domain/entities/taskAssignment";
import { ITaskRepository } from "../../domain/repositories/Itask.repository";
import { connection } from "../../../../config/postgres/postgres-sequelize";
import { Transaction } from "sequelize";

export class TaskRepository implements ITaskRepository {
  async save(task: Task, transaction?: Transaction): Promise<Task> {
    try {
      // Create task in database
      const createdTask = await TaskModel.create({
        projectId: task.projectId,
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate
      }, { transaction });

      // Map DB entity to domain entity
      return Task.create({
        id: createdTask.id,
        projectId: createdTask.projectId,
        title: createdTask.title,
        description: createdTask.description,
        status: createdTask.status,
        dueDate: createdTask.dueDate,
        createdAt: createdTask.createdAt,
        updatedAt: createdTask.updatedAt
      });
    } catch (error: any) {
      console.error("Error in save task:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error creating task',
        detailsError: error
      });
    }
  }

  async findById(id: string): Promise<Task | null> {
    try {
      const task = await TaskModel.findByPk(id);
      
      if (!task) {
        return null;
      }
      
      return Task.create({
        id: task.id,
        projectId: task.projectId,
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      });
    } catch (error: any) {
      console.error("Error in findById task:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error finding task by id',
        detailsError: error
      });
    }
  }

  async findByProjectId(projectId: string): Promise<Task[]> {
    try {
      const tasks = await TaskModel.findAll({
        where: { projectId }
      });
      
      return tasks.map(task => Task.create({
        id: task.id,
        projectId: task.projectId,
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }));
    } catch (error: any) {
      console.error("Error in findByProjectId task:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error finding tasks by project id',
        detailsError: error
      });
    }
  }

  async update(id: string, taskData: Partial<Task>, userId: string, transaction?: Transaction): Promise<Task | null> {
    try {
      const task = await TaskModel.findByPk(id);
      
      if (!task) {
        return null;
      }
      
      // Store old values to create history entries
      const oldValues = {
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate
      };
      
      // Update task
      await task.update({
        title: taskData.title !== undefined ? taskData.title : task.title,
        description: taskData.description !== undefined ? taskData.description : task.description,
        status: taskData.status !== undefined ? taskData.status : task.status,
        dueDate: taskData.dueDate !== undefined ? taskData.dueDate : task.dueDate
      }, { transaction });
      
      // Create history entries for each changed field
      const historyPromises = [];
      
      if (taskData.title !== undefined && taskData.title !== oldValues.title) {
        historyPromises.push(this.addHistory(TaskHistory.create({
          id: '',
          taskId: id,
          changedBy: userId,
          changeType: 'title',
          oldValue: oldValues.title,
          newValue: taskData.title
        }), transaction));
      }
      
      if (taskData.description !== undefined && taskData.description !== oldValues.description) {
        historyPromises.push(this.addHistory(TaskHistory.create({
          id: '',
          taskId: id,
          changedBy: userId,
          changeType: 'description',
          oldValue: oldValues.description,
          newValue: taskData.description
        }), transaction));
      }
      
      if (taskData.status !== undefined && taskData.status !== oldValues.status) {
        historyPromises.push(this.addHistory(TaskHistory.create({
          id: '',
          taskId: id,
          changedBy: userId,
          changeType: 'status',
          oldValue: oldValues.status,
          newValue: taskData.status
        }), transaction));
      }
        if (taskData.dueDate !== undefined) {
        // Convierte las fechas a formato de cadena para comparación segura
        const oldDateStr = oldValues.dueDate ? 
          (oldValues.dueDate instanceof Date ? 
            oldValues.dueDate.toISOString().split('T')[0] : 
            String(oldValues.dueDate)) : null;
        
        const newDateStr = taskData.dueDate ? 
          (taskData.dueDate instanceof Date ? 
            taskData.dueDate.toISOString().split('T')[0] : 
            String(taskData.dueDate)) : null;
        
        if (oldDateStr !== newDateStr) {
          historyPromises.push(this.addHistory(TaskHistory.create({
            id: '',
            taskId: id,
            changedBy: userId,            changeType: 'dueDate',
            oldValue: oldDateStr,
            newValue: newDateStr
          }), transaction));
        }
      }
      
      // Use Promise.all to execute all history entries creation in parallel
      if (historyPromises.length > 0) {
        await Promise.all(historyPromises);
      }
      
      // Return the updated task
      return Task.create({
        id: task.id,
        projectId: task.projectId,
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      });
    } catch (error: any) {
      console.error("Error in update task:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error updating task',
        detailsError: error
      });
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const numDeleted = await TaskModel.destroy({
        where: { id }
      });
      
      return numDeleted > 0;
    } catch (error: any) {
      console.error("Error in delete task:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error deleting task',
        detailsError: error
      });
    }
  }

  async addComment(comment: TaskComment, transaction?: Transaction): Promise<TaskComment> {
    try {
      const createdComment = await TaskCommentModel.create({
        taskId: comment.taskId,
        userId: comment.userId,
        comment: comment.comment
      }, { transaction });
      
      return TaskComment.create({
        id: createdComment.id,
        taskId: createdComment.taskId,
        userId: createdComment.userId,
        comment: createdComment.comment,
        createdAt: createdComment.createdAt,
        updatedAt: createdComment.updatedAt
      });
    } catch (error: any) {
      console.error("Error in addComment:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error adding comment to task',
        detailsError: error
      });
    }
  }

  async getCommentsByTaskId(taskId: string): Promise<TaskComment[]> {
    try {
      const comments = await TaskCommentModel.findAll({
        where: { taskId },
        order: [['created_at', 'DESC']]
      });
      
      return comments.map(comment => TaskComment.create({
        id: comment.id,
        taskId: comment.taskId,
        userId: comment.userId,
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
      }));
    } catch (error: any) {
      console.error("Error in getCommentsByTaskId:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error getting task comments',
        detailsError: error
      });
    }
  }

  async addHistory(history: TaskHistory, transaction?: Transaction): Promise<TaskHistory> {
    try {
      const createdHistory = await TaskHistoryModel.create({
        taskId: history.taskId,
        changedBy: history.changedBy,
        changeType: history.changeType,
        oldValue: history.oldValue,
        newValue: history.newValue,
        changedAt: history.changedAt
      }, { transaction });
      
      return TaskHistory.create({
        id: createdHistory.id,
        taskId: createdHistory.taskId,
        changedBy: createdHistory.changedBy,
        changeType: createdHistory.changeType,
        oldValue: createdHistory.oldValue,
        newValue: createdHistory.newValue,
        changedAt: createdHistory.changedAt,
        createdAt: createdHistory.createdAt,
        updatedAt: createdHistory.updatedAt
      });
    } catch (error: any) {
      console.error("Error in addHistory:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error adding history entry to task',
        detailsError: error
      });
    }
  }

  async getHistoryByTaskId(taskId: string): Promise<TaskHistory[]> {
    try {
      const historyEntries = await TaskHistoryModel.findAll({
        where: { taskId },
        order: [['changed_at', 'DESC']]
      });
      
      return historyEntries.map(entry => TaskHistory.create({
        id: entry.id,
        taskId: entry.taskId,
        changedBy: entry.changedBy,
        changeType: entry.changeType,
        oldValue: entry.oldValue,
        newValue: entry.newValue,
        changedAt: entry.changedAt,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt
      }));
    } catch (error: any) {
      console.error("Error in getHistoryByTaskId:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error getting task history',
        detailsError: error
      });
    }
  }
  // Transaction management methods will be implemented at the end of the class
  
  // Task Assignment operations
  async assignTask(assignment: TaskAssignment, transaction?: Transaction): Promise<TaskAssignment> {
    try {
      // Check if assignment already exists
      const existingAssignment = await this.findTaskAssignment(assignment.taskId, assignment.userId);
      
      if (existingAssignment) {
        throw new AppError({
          status: HttpCode.CONFLICT,
          message: 'User is already assigned to this task'
        });
      }
      
      // Create the assignment
      const createdAssignment = await TaskAssignmentModel.create({
        taskId: assignment.taskId,
        userId: assignment.userId,
        assignedAt: assignment.assignedAt || new Date()
      }, { transaction });
      
      return TaskAssignment.create({
        id: createdAssignment.id,
        taskId: createdAssignment.taskId,
        userId: createdAssignment.userId,
        assignedAt: createdAssignment.assignedAt,
        createdAt: createdAssignment.createdAt,
        updatedAt: createdAssignment.updatedAt
      });
    } catch (error: any) {
      console.error("Error in assignTask:", error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error assigning task to user',
        detailsError: error
      });
    }
  }
  async assignTasks(assignments: TaskAssignment[], transaction?: Transaction): Promise<TaskAssignment[]> {
    try {
      // Prepare assignment data
      const assignmentData = assignments.map(assignment => ({
        taskId: assignment.taskId,
        userId: assignment.userId,
        assignedAt: assignment.assignedAt || new Date()
      }));
      
      // Create all assignments at once
      const createdAssignments = await TaskAssignmentModel.bulkCreate(assignmentData, { 
        transaction,
        // This will ignore duplicates in case any already exist
        updateOnDuplicate: ["assignedAt", "updatedAt"] 
      });
      
      return createdAssignments.map(assignment => TaskAssignment.create({
        id: assignment.id,
        taskId: assignment.taskId,
        userId: assignment.userId,
        assignedAt: assignment.assignedAt,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt
      }));
    } catch (error: any) {
      console.error("Error in assignTasks:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error assigning tasks to users',
        detailsError: error
      });
    }
  }

  async getTaskAssignments(taskId: string): Promise<TaskAssignment[]> {
    try {
      const assignments = await TaskAssignmentModel.findAll({
        where: { taskId },
        include: [{ model: UserModel, as: 'user' }]
      });
      
      return assignments.map(assignment => TaskAssignment.create({
        id: assignment.id,
        taskId: assignment.taskId,
        userId: assignment.userId,
        assignedAt: assignment.assignedAt,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt
      }));
    } catch (error: any) {
      console.error("Error in getTaskAssignments:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving task assignments',
        detailsError: error
      });
    }
  }

  async removeTaskAssignment(taskId: string, userId: string, transaction?: Transaction): Promise<boolean> {
    try {
      const numDeleted = await TaskAssignmentModel.destroy({
        where: { taskId, userId },
        transaction
      });
      
      return numDeleted > 0;
    } catch (error: any) {
      console.error("Error in removeTaskAssignment:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error removing task assignment',
        detailsError: error
      });
    }
  }

  async findTaskAssignment(taskId: string, userId: string): Promise<TaskAssignment | null> {
    try {
      const assignment = await TaskAssignmentModel.findOne({
        where: { taskId, userId }
      });
      
      if (!assignment) {
        return null;
      }
      
      return TaskAssignment.create({
        id: assignment.id,
        taskId: assignment.taskId,
        userId: assignment.userId,
        assignedAt: assignment.assignedAt,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt      });
    } catch (error: any) {
      console.error("Error in findTaskAssignment:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error finding task assignment',
        detailsError: error
      });
    }
  }
  
  // Transaction management methods
  async getTransaction(): Promise<Transaction> {
    return await connection.transaction();
  }
  
  async commitTransaction(transaction: Transaction): Promise<void> {
    await transaction.commit();
  }
  
  async rollbackTransaction(transaction: Transaction): Promise<void> {
    await transaction.rollback();
  }
}
