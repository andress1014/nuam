import { Project } from "../entities/project";
import { ProjectMember } from "../entities/projectMember";
import { Transaction } from "sequelize";

// Repository interface that defines operations for project data management
export interface IProjectRepository {
  save(project: Project): Promise<Project>;
  findById(id: string): Promise<Project | null>;
  findByUserId(userId: string): Promise<Project[]>;
  findAll(): Promise<Project[]>;
  update(id: string, projectData: Partial<Project>): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
  
  // Project member operations
  addMember(member: ProjectMember, transaction?: Transaction): Promise<ProjectMember>;
  addMembers(members: ProjectMember[], transaction?: Transaction): Promise<ProjectMember[]>;
  findMembersByProjectId(projectId: string): Promise<ProjectMember[]>;
  findMemberByProjectAndUser(projectId: string, userId: string): Promise<ProjectMember | null>;
  updateMemberRole(projectId: string, userId: string, role: 'owner' | 'editor' | 'viewer', transaction?: Transaction): Promise<ProjectMember | null>;
  removeMember(projectId: string, userId: string, transaction?: Transaction): Promise<boolean>;
  
  // Transaction management
  getTransaction(): Promise<Transaction>;
  commitTransaction(transaction: Transaction): Promise<void>;
  rollbackTransaction(transaction: Transaction): Promise<void>;
}
