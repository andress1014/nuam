import { AppError, HttpCode } from "../../../../helpers";
import { Project } from "../../domain/entities/project";
import { IProjectRepository } from "../../domain/repositories/Iproject.repository";
import { CreateProjectDto } from "../dto/createProject.dto";

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(projectData: CreateProjectDto): Promise<Project> {
    try {
      // Crear directamente el objeto Project
      const projectToSave = new Project(
        '', // id vacío para nueva creación
        projectData.name,
        projectData.description || null,
        projectData.userId, // El ID del usuario que crea el proyecto
        undefined,
        undefined
      );
      
      // Guardar y devolver el nuevo proyecto
      return await this.projectRepository.save(projectToSave);
    } catch (error) {
      console.error("Error creating project:", error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error during project creation',
        detailsError: error
      });
    }
  }
}
