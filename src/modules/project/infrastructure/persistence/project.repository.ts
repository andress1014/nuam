import { AppError, HttpCode } from "../../../../helpers";
import { ProjectModel, ProjectMemberModel, UserModel } from "../../../../models";
import { Project } from "../../domain/entities/project";
import { ProjectMember } from "../../domain/entities/projectMember";
import { IProjectRepository } from "../../domain/repositories/Iproject.repository";
import { connection } from "../../../../config/postgres/postgres-sequelize";
import { Transaction } from "sequelize";

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

  // Project Member operations
  async addMember(member: ProjectMember, transaction?: Transaction): Promise<ProjectMember> {
    try {
      const createdMember = await ProjectMemberModel.create({
        projectId: member.projectId,
        userId: member.userId,
        role: member.role,
        addedAt: member.addedAt || new Date()
      }, { transaction });

      return ProjectMember.create({
        id: createdMember.id,
        projectId: createdMember.projectId,
        userId: createdMember.userId,
        role: createdMember.role,
        addedAt: createdMember.addedAt,
        createdAt: createdMember.createdAt,
        updatedAt: createdMember.updatedAt
      });
    } catch (error: any) {
      console.error("Error adding project member:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error adding user to project',
        detailsError: error
      });
    }
  }

  async addMembers(members: ProjectMember[], transaction?: Transaction): Promise<ProjectMember[]> {
    try {
      const memberData = members.map(member => ({
        projectId: member.projectId,
        userId: member.userId,
        role: member.role,
        addedAt: member.addedAt || new Date()
      }));

      const createdMembers = await ProjectMemberModel.bulkCreate(memberData, { transaction });

      return createdMembers.map(member => ProjectMember.create({
        id: member.id,
        projectId: member.projectId,
        userId: member.userId,
        role: member.role,
        addedAt: member.addedAt,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt
      }));
    } catch (error: any) {
      console.error("Error adding multiple project members:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error adding users to project',
        detailsError: error
      });
    }
  }

  async findMembersByProjectId(projectId: string): Promise<ProjectMember[]> {
    try {
      const members = await ProjectMemberModel.findAll({
        where: { projectId },
        include: [{ model: UserModel, as: 'user' }]
      });

      return members.map(member => ProjectMember.create({
        id: member.id,
        projectId: member.projectId,
        userId: member.userId,
        role: member.role,
        addedAt: member.addedAt,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt
      }));
    } catch (error: any) {
      console.error("Error finding project members:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving project members',
        detailsError: error
      });
    }
  }

  async findMemberByProjectAndUser(projectId: string, userId: string): Promise<ProjectMember | null> {
    try {
      const member = await ProjectMemberModel.findOne({
        where: { projectId, userId }
      });

      if (!member) {
        return null;
      }

      return ProjectMember.create({
        id: member.id,
        projectId: member.projectId,
        userId: member.userId,
        role: member.role,
        addedAt: member.addedAt,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt
      });
    } catch (error: any) {
      console.error("Error finding project member:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving project member',
        detailsError: error
      });
    }
  }

  async updateMemberRole(projectId: string, userId: string, role: 'owner' | 'editor' | 'viewer', transaction?: Transaction): Promise<ProjectMember | null> {
    try {
      const member = await ProjectMemberModel.findOne({
        where: { projectId, userId }
      });

      if (!member) {
        return null;
      }

      await member.update({ role }, { transaction });

      return ProjectMember.create({
        id: member.id,
        projectId: member.projectId,
        userId: member.userId,
        role: member.role,
        addedAt: member.addedAt,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt
      });
    } catch (error: any) {
      console.error("Error updating project member role:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error updating project member role',
        detailsError: error
      });
    }
  }

  async removeMember(projectId: string, userId: string, transaction?: Transaction): Promise<boolean> {
    try {
      const deletedCount = await ProjectMemberModel.destroy({
        where: { projectId, userId },
        transaction
      });

      return deletedCount > 0;
    } catch (error: any) {
      console.error("Error removing project member:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error removing user from project',
        detailsError: error
      });
    }
  }

  // Transaction management
  async getTransaction(): Promise<Transaction> {
    return await connection.transaction();
  }

  async commitTransaction(transaction: Transaction): Promise<void> {
    await transaction.commit();
  }

  async rollbackTransaction(transaction: Transaction): Promise<void> {
    await transaction.rollback();
  }
}
