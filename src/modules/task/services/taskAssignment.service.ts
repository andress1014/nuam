import { Transaction } from "sequelize";
import { connection } from "../../../config/postgres/postgres-sequelize";
import { ProjectMemberModel, TaskAssignmentModel, TaskModel } from "../../../models";
import { TaskAssignmentItem } from "../application/dto/assignTasks.dto";
import { AppError, HttpCode } from "../../../helpers";

export class TaskAssignmentService {
  async validateUsersInProject(projectId: string, userIds: string[]): Promise<boolean> {
    try {
      // Get count of members that match the given project and user IDs
      const memberCount = await ProjectMemberModel.count({
        where: {
          projectId: projectId,
          userId: userIds,
          role: ['owner', 'editor'] // Only owners and editors can be assigned to tasks
        }
      });
      
      // All users should be found in the project with appropriate roles
      return memberCount === userIds.length;
    } catch (error: any) {
      console.error("Error validating users in project:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error validating user permissions for task assignment',
        detailsError: error
      });
    }
  }
  
  async validateTasksInProject(projectId: string, taskIds: string[]): Promise<boolean> {
    try {
      // Get count of tasks that match the given IDs and project
      const taskCount = await TaskModel.count({
        where: {
          id: taskIds,
          projectId: projectId
        }
      });
      
      // All tasks should belong to the project
      return taskCount === taskIds.length;
    } catch (error: any) {
      console.error("Error validating tasks in project:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error validating tasks for assignment',
        detailsError: error
      });
    }
  }
  
  async assignTasksToUsers(assignments: TaskAssignmentItem[], transaction: Transaction): Promise<void> {
    try {
      // Format data for bulk create
      const assignmentData = assignments.map(assignment => ({
        taskId: assignment.taskId,
        userId: assignment.userId,
        assignedAt: new Date()
      }));
      
      // Create all assignments at once
      await TaskAssignmentModel.bulkCreate(assignmentData, {
        transaction,
        // Ignore duplicate assignments
        ignoreDuplicates: true
      });
    } catch (error: any) {
      console.error("Error assigning tasks to users:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error assigning tasks to users',
        detailsError: error
      });
    }
  }
  
  async bulkAssignTasks(projectId: string, assignments: TaskAssignmentItem[]): Promise<void> {
    // Get unique user IDs and task IDs from assignments
    const userIds = [...new Set(assignments.map(a => a.userId))];
    const taskIds = [...new Set(assignments.map(a => a.taskId))];
    
    // Start a transaction
    const transaction = await connection.transaction();
    
    try {
      // Validate that all users are members of the project with appropriate permissions
      const usersValid = await this.validateUsersInProject(projectId, userIds);
      if (!usersValid) {
        throw new AppError({
          status: HttpCode.FORBIDDEN,
          message: 'One or more users do not have permissions to be assigned tasks in this project'
        });
      }
      
      // Validate that all tasks belong to the project
      const tasksValid = await this.validateTasksInProject(projectId, taskIds);
      if (!tasksValid) {
        throw new AppError({
          status: HttpCode.BAD_REQUEST,
          message: 'One or more tasks do not belong to this project'
        });
      }
      
      // Assign the tasks to users
      await this.assignTasksToUsers(assignments, transaction);
      
      // Commit the transaction
      await transaction.commit();
    } catch (error) {
      // Rollback if anything fails
      await transaction.rollback();
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error assigning tasks to users',
        detailsError: error
      });
    }
  }
}
