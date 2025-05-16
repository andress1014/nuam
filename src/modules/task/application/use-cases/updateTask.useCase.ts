import { AppError, HttpCode } from "../../../../helpers";
import { Task } from "../../domain/entities/task";
import { ITaskRepository } from "../../domain/repositories/Itask.repository";
import { UpdateTaskDto } from "../dto/updateTask.dto";

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(taskData: UpdateTaskDto, userId: string): Promise<Task> {
    try {
      // Get a transaction
      const transaction = await this.taskRepository.getTransaction();
      
      try {
        // Update task with transaction
        const updatedTask = await this.taskRepository.update(
          taskData.id,
          {
            title: taskData.title,
            description: taskData.description,
            status: taskData.status as any,
            dueDate: taskData.dueDate
          },
          userId,
          transaction
        );
        
        if (!updatedTask) {
          throw new AppError({
            status: HttpCode.NOT_FOUND,
            message: `Task with ID ${taskData.id} not found`
          });
        }
        
        // Commit the transaction
        await this.taskRepository.commitTransaction(transaction);
        
        return updatedTask;
      } catch (error) {
        // Rollback the transaction in case of error
        await this.taskRepository.rollbackTransaction(transaction);
        throw error;
      }
    } catch (error) {
      console.error("Error updating task:", error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error updating task',
        detailsError: error
      });
    }
  }
}
