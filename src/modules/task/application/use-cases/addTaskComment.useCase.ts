import { AppError, HttpCode } from "../../../../helpers";
import { TaskComment } from "../../domain/entities/taskComment";
import { ITaskRepository } from "../../domain/repositories/Itask.repository";
import { AddTaskCommentDto } from "../dto/addTaskComment.dto";

export class AddTaskCommentUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(commentData: AddTaskCommentDto): Promise<TaskComment> {
    try {
      // Check if task exists
      const task = await this.taskRepository.findById(commentData.taskId);
      
      if (!task) {
        throw new AppError({
          status: HttpCode.NOT_FOUND,
          message: `Task with ID ${commentData.taskId} not found`
        });
      }
      
      // Create transaction
      const transaction = await this.taskRepository.getTransaction();
      
      try {
        // Create comment object
        const comment = TaskComment.create({
          id: '',
          taskId: commentData.taskId,
          userId: commentData.userId,
          comment: commentData.comment
        });
        
        // Save comment
        const savedComment = await this.taskRepository.addComment(comment, transaction);
        
        // Add history entry for the comment
        await this.taskRepository.addHistory({
          id: '',
          taskId: commentData.taskId,
          changedBy: commentData.userId,
          changeType: 'comment_added',
          oldValue: null,
          newValue: `Comment ID: ${savedComment.id}`,
          changedAt: new Date()
        } as any, transaction);
        
        // Commit transaction
        await this.taskRepository.commitTransaction(transaction);
        
        return savedComment;
      } catch (error) {
        // Rollback transaction in case of error
        await this.taskRepository.rollbackTransaction(transaction);
        throw error;
      }
    } catch (error) {
      console.error("Error adding task comment:", error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error adding task comment',
        detailsError: error
      });
    }
  }
}
