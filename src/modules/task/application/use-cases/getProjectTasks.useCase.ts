import { AppError, HttpCode } from "../../../../helpers";
import { ITaskRepository } from "../../domain/repositories/Itask.repository";
import { Task } from "../../domain/entities/task";

export class GetProjectTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(projectId: string): Promise<Task[]> {
    try {
      return await this.taskRepository.findByProjectId(projectId);
    } catch (error) {
      console.error("Error getting project tasks:", error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving project tasks',
        detailsError: error
      });
    }
  }
}
