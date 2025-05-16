import { Project } from "../entities/project";

// Repository interface that defines operations for project data management
export interface IProjectRepository {
  save(project: Project): Promise<Project>;
  findById(id: string): Promise<Project | null>;
  findByUserId(userId: string): Promise<Project[]>;
  findAll(): Promise<Project[]>;
  update(id: string, projectData: Partial<Project>): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
}
