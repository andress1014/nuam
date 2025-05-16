import { AppError, HttpCode } from "../../../../helpers";
import { Task } from "../../domain/entities/task";
import { ITaskRepository } from "../../domain/repositories/Itask.repository";

export class GetTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findById(id);
      
      if (!task) {
        throw new AppError({
          status: HttpCode.NOT_FOUND,
          message: `Task with ID ${id} not found`
        });
      }
      
      return task;
    } catch (error) {
      console.error("Error getting task:", error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving task',
        detailsError: error
      });
    }
  }
}
