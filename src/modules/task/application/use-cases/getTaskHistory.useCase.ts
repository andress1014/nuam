import { AppError, HttpCode } from "../../../../helpers";
import { TaskHistory } from "../../domain/entities/taskHistory";
import { ITaskRepository } from "../../domain/repositories/Itask.repository";

export class GetTaskHistoryUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(taskId: string): Promise<TaskHistory[]> {
    try {
      // Check if task exists
      const task = await this.taskRepository.findById(taskId);
      
      if (!task) {
        throw new AppError({
          status: HttpCode.NOT_FOUND,
          message: `Task with ID ${taskId} not found`
        });
      }
      
      // Get history
      return await this.taskRepository.getHistoryByTaskId(taskId);
    } catch (error) {
      console.error("Error getting task history:", error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving task history',
        detailsError: error
      });
    }
  }
}
