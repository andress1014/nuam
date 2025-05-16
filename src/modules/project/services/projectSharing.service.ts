import { Transaction } from "sequelize";
import { connection } from "../../../config/postgres/postgres-sequelize";
import { ProjectMemberModel, ProjectModel } from "../../../models";
import { AppError, HttpCode } from "../../../helpers";

export class ProjectSharingService {
  async validateProject(projectId: string): Promise<boolean> {
    try {
      const project = await ProjectModel.findByPk(projectId);
      return !!project;
    } catch (error: any) {
      console.error("Error validating project:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error validating project',
        detailsError: error
      });
    }
  }
  
  async checkUserPermission(projectId: string, userId: string, requiredRole: 'owner' | 'editor' | 'viewer' = 'owner'): Promise<boolean> {
    try {
      // Find the user's membership in the project
      const membership = await ProjectMemberModel.findOne({
        where: { projectId, userId }
      });
      
      // If no membership, user doesn't have permission
      if (!membership) {
        return false;
      }
      
      // Check if the user's role has sufficient permissions
      switch (requiredRole) {
        case 'owner':
          return membership.role === 'owner';
        case 'editor':
          return membership.role === 'owner' || membership.role === 'editor';
        case 'viewer':
          return true; // All roles can view
        default:
          return false;
      }
    } catch (error: any) {
      console.error("Error checking user permission:", error);
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error checking user permission for project',
        detailsError: error
      });
    }
  }
  
  async shareProject(projectId: string, userIds: string[], role: 'owner' | 'editor' | 'viewer', sharingUserId: string): Promise<void> {
    // Verify the project exists
    const projectExists = await this.validateProject(projectId);
    if (!projectExists) {
      throw new AppError({
        status: HttpCode.NOT_FOUND,
        message: 'Project not found'
      });
    }
    
    // Verify the sharing user has owner permissions
    const hasPermission = await this.checkUserPermission(projectId, sharingUserId, 'owner');
    if (!hasPermission) {
      throw new AppError({
        status: HttpCode.FORBIDDEN,
        message: 'You do not have permission to share this project'
      });
    }
    
    // Start a transaction
    const transaction = await connection.transaction();
    
    try {
      // Prepare member data for all users
      const memberData = userIds.map(userId => ({
        projectId,
        userId,
        role,
        addedAt: new Date()
      }));
        // Add all members at once
      await ProjectMemberModel.bulkCreate(memberData, {
        transaction,
        // Update role if user is already a member
        updateOnDuplicate: ['role', 'addedAt', 'updatedAt']
      });
      
      // Commit the transaction
      await transaction.commit();
    } catch (error) {
      // Rollback if anything fails
      await transaction.rollback();
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        status: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Error sharing project with users',
        detailsError: error
      });
    }
  }
}
