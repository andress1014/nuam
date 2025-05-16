import { AppError, HttpCode } from "../../../../helpers";
import { IProjectRepository } from "../../domain/repositories/Iproject.repository";
import { ProjectDto } from "../dto/project.dto";

export class GetProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<ProjectDto> {
    try {
      const project = await this.projectRepository.findById(id);
      
      if (!project) {
        throw new AppError({
          status: HttpCode.NOT_FOUND,
          message: 'Project not found'
        });
      }
      
      return ProjectDto.fromEntity(project);
    } catch (error) {
      console.error("Error getting project:", error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving project',
        detailsError: error
      });
    }
  }
}
