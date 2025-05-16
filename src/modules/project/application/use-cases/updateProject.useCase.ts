import { AppError, HttpCode } from "../../../../helpers";
import { IProjectRepository } from "../../domain/repositories/Iproject.repository";
import { UpdateProjectDto } from "../dto/updateProject.dto";
import { ProjectDto } from "../dto/project.dto";

export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(projectData: UpdateProjectDto): Promise<ProjectDto> {
    try {
      // Buscar el proyecto por ID
      const existingProject = await this.projectRepository.findById(projectData.id);
      
      if (!existingProject) {
        throw new AppError({
          status: HttpCode.NOT_FOUND,
          message: 'Project not found'
        });
      }
      
      // Actualizar el proyecto
      const updatedProject = await this.projectRepository.update(
        projectData.id, 
        {
          name: projectData.name,
          description: projectData.description
        }
      );
      
      if (!updatedProject) {
        throw new AppError({
          status: HttpCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to update project'
        });
      }
      
      return ProjectDto.fromEntity(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error during project update',
        detailsError: error
      });
    }
  }
}
