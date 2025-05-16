import { AppError, HttpCode } from "../../../../helpers";
import { Project } from "../../domain/entities/project";
import { ProjectMember } from "../../domain/entities/projectMember";
import { IProjectRepository } from "../../domain/repositories/Iproject.repository";
import { CreateProjectDto } from "../dto/createProject.dto";

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(projectData: CreateProjectDto): Promise<Project> {
    // Iniciar una transacción para asegurar la consistencia
    const transaction = await this.projectRepository.getTransaction();
    
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
      
      // Guardar el proyecto en la transacción
      const savedProject = await this.projectRepository.save(projectToSave);
      
      // Crear un registro en la tabla project_members para asignar al creador como owner
      const projectMember = new ProjectMember(
        '', // id vacío para nueva creación
        savedProject.id, // ID del proyecto recién creado
        projectData.userId, // El mismo usuario que creó el proyecto
        'owner', // Rol owner
        new Date(), // fecha actual
        undefined,
        undefined
      );
      
      // Añadir el miembro del proyecto
      await this.projectRepository.addMember(projectMember, transaction);
      
      // Confirmar la transacción
      await this.projectRepository.commitTransaction(transaction);
      
      return savedProject;
    } catch (error) {
      // Revertir la transacción en caso de error
      await this.projectRepository.rollbackTransaction(transaction);
      
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
