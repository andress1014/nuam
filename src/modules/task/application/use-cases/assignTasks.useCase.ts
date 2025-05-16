import { AppError, HttpCode } from "../../../../helpers";
import { AssignTasksDto } from "../dto/assignTasks.dto";
import { TaskAssignmentService } from "../../services/taskAssignment.service";

export class AssignTasksUseCase {
  constructor(private readonly taskAssignmentService: TaskAssignmentService) {}
  
  async execute(assignTasksDto: AssignTasksDto): Promise<void> {
    try {
      await this.taskAssignmentService.bulkAssignTasks(
        assignTasksDto.projectId,
        assignTasksDto.assignments
      );
    } catch (error) {
      console.error("Error assigning tasks:", error);
      
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
