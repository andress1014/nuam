import { AppError, HttpCode } from "../../../../helpers";
import { IProjectRepository } from "../../domain/repositories/Iproject.repository";
import { ProjectDto } from "../dto/project.dto";

export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string, userId: string): Promise<boolean> {
    try {
      // Buscar el proyecto por ID
      const project = await this.projectRepository.findById(id);
      
      if (!project) {
        throw new AppError({
          status: HttpCode.NOT_FOUND,
          message: 'Project not found'
        });
      }
      
      // Verificar que el usuario es el propietario del proyecto
      if (project.createdBy !== userId) {
        throw new AppError({
          status: HttpCode.FORBIDDEN,
          message: 'You do not have permission to delete this project'
        });
      }
      
      // Eliminar el proyecto
      const result = await this.projectRepository.delete(id);
      
      if (!result) {
        throw new AppError({
          status: HttpCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete project'
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error deleting project:", error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error during project deletion',
        detailsError: error
      });
    }
  }
}
