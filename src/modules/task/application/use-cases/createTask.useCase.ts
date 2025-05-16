import { AppError, HttpCode } from "../../../../helpers";
import { Task } from "../../domain/entities/task";
import { ITaskRepository } from "../../domain/repositories/Itask.repository";
import { CreateTaskDto } from "../dto/createTask.dto";

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(taskData: CreateTaskDto): Promise<Task> {
    try {
      // Create Task object
      const taskToSave = new Task(
        '', // id empty for new creation
        taskData.projectId,
        taskData.title,
        taskData.description || null,
        taskData.status as any || 'pending',
        taskData.dueDate || null
      );
      
      // Save and return the new task
      return await this.taskRepository.save(taskToSave);
    } catch (error) {
      console.error("Error creating task:", error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error creating task',
        detailsError: error
      });
    }
  }
}
