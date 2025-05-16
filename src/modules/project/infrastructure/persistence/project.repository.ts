import { AppError, HttpCode } from "../../../../helpers";
import { ProjectModel } from "../../../../models";
import { Project } from "../../domain/entities/project";
import { IProjectRepository } from "../../domain/repositories/Iproject.repository";

export class ProjectRepository implements IProjectRepository {
  async save(project: Project): Promise<Project> {
    try {
      // Create project in database
      const createdProject = await ProjectModel.create({
        name: project.name,
        description: project.description,
        createdBy: project.createdBy
      });

      // Map DB entity to domain entity
      return Project.create({
        id: createdProject.id,
        name: createdProject.name,
        description: createdProject.description,
        createdBy: createdProject.createdBy,
        created_at: createdProject.createdAt,
        updatedAt: createdProject.updatedAt
      });
    } catch (error: any) {
      console.error("Error in save project:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error creating project',
        detailsError: error
      });
    }
  }

  async findById(id: string): Promise<Project | null> {
    try {
      const project = await ProjectModel.findByPk(id);
      
      if (!project) return null;
      
      return Project.create({
        id: project.id,
        name: project.name,
        description: project.description,
        createdBy: project.createdBy,
        created_at: project.createdAt,
        updatedAt: project.updatedAt
      });
    } catch (error) {
      console.error("Error in findById project:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error finding project',
        detailsError: error
      });
    }
  }

  async findByUserId(userId: string): Promise<Project[]> {
    try {
      const projects = await ProjectModel.findAll({
        where: { createdBy: userId }
      });
      
      return projects.map(project => Project.create({
        id: project.id,
        name: project.name,
        description: project.description,
        createdBy: project.createdBy,
        created_at: project.createdAt,
        updatedAt: project.updatedAt
      }));
    } catch (error) {
      console.error("Error in findByUserId project:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error finding user projects',
        detailsError: error
      });
    }
  }

  async findAll(): Promise<Project[]> {
    try {
      const projects = await ProjectModel.findAll();
      
      return projects.map(project => Project.create({
        id: project.id,
        name: project.name,
        description: project.description,
        createdBy: project.createdBy,
        created_at: project.createdAt,
        updatedAt: project.updatedAt
      }));
    } catch (error) {
      console.error("Error in findAll projects:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving all projects',
        detailsError: error
      });
    }
  }

  async update(id: string, projectData: Partial<Project>): Promise<Project | null> {
    try {
      const project = await ProjectModel.findByPk(id);
      
      if (!project) return null;
      
      await project.update(projectData);
      
      return Project.create({
        id: project.id,
        name: project.name,
        description: project.description,
        createdBy: project.createdBy,
        created_at: project.createdAt,
        updatedAt: project.updatedAt
      });
    } catch (error) {
      console.error("Error in update project:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error updating project',
        detailsError: error
      });
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const project = await ProjectModel.findByPk(id);
      
      if (!project) return false;
      
      await project.destroy();
      return true;
    } catch (error) {
      console.error("Error in delete project:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error deleting project',
        detailsError: error
      });
    }
  }
}
