import { AppError, HttpCode } from "../../../../helpers";
import { ITaskRepository } from "../../domain/repositories/Itask.repository";

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    try {
      const deleted = await this.taskRepository.delete(id);
      
      if (!deleted) {
        throw new AppError({
          status: HttpCode.NOT_FOUND,
          message: `Task with ID ${id} not found or could not be deleted`
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error deleting task',
        detailsError: error
      });
    }
  }
}
