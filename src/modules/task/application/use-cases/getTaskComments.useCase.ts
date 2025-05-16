import { AppError, HttpCode } from "../../../../helpers";
import { TaskComment } from "../../domain/entities/taskComment";
import { ITaskRepository } from "../../domain/repositories/Itask.repository";

export class GetTaskCommentsUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(taskId: string): Promise<TaskComment[]> {
    try {
      // Check if task exists
      const task = await this.taskRepository.findById(taskId);
      
      if (!task) {
        throw new AppError({
          status: HttpCode.NOT_FOUND,
          message: `Task with ID ${taskId} not found`
        });
      }
      
      // Get comments
      return await this.taskRepository.getCommentsByTaskId(taskId);
    } catch (error) {
      console.error("Error getting task comments:", error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving task comments',
        detailsError: error
      });
    }
  }
}
