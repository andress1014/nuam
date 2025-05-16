import { AppError, HttpCode } from "../../../../helpers";
import { IProjectRepository } from "../../domain/repositories/Iproject.repository";
import { ProjectDto } from "../dto/project.dto";

export class GetUserProjectsUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(userId: string): Promise<ProjectDto[]> {
    try {
      const projects = await this.projectRepository.findByUserId(userId);
      
      return projects.map(project => ProjectDto.fromEntity(project));
    } catch (error) {
      console.error("Error getting user projects:", error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving user projects',
        detailsError: error
      });
    }
  }
}
