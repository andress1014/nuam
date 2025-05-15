import { Sequelize } from 'sequelize';

// Import all models
import { UserModel } from './user/user.model';
import { ProjectModel } from './project/project.model';
import { ProjectMemberModel } from './projectMember/projectMember.model';
import { TaskModel } from './task/task.model';
import { TaskAssignmentModel } from './taskAssignment/taskAssignment.model';
import { TaskCommentModel } from './taskComment/taskComment.model';
import { TaskHistoryModel } from './taskHistory/taskHistory.model';

// Export all model types
export * from './user/user.model.interface';
export * from './project/project.model.interface';
export * from './projectMember/projectMember.model.interface';
export * from './task/task.model.interface';
export * from './taskAssignment/taskAssignment.model.interface';
export * from './taskComment/taskComment.model.interface';
export * from './taskHistory/taskHistory.model.interface';

// Create models registry for easy access
export const models = {
  UserModel,
  ProjectModel,
  ProjectMemberModel,
  TaskModel,
  TaskAssignmentModel,
  TaskCommentModel,
  TaskHistoryModel,
};

// Initialize all models function
export const initializeModels = (sequelize: Sequelize): void => {
  // Initialize all models
  UserModel.initialize(sequelize);
  ProjectModel.initialize(sequelize);
  ProjectMemberModel.initialize(sequelize);
  TaskModel.initialize(sequelize);
  TaskAssignmentModel.initialize(sequelize);
  TaskCommentModel.initialize(sequelize);
  TaskHistoryModel.initialize(sequelize);

  // Set up associations between models
  Object.values(models).forEach((model) => {
    if (typeof model.associate === 'function') {
      model.associate(models);
    }
  });
};

// Export the model classes individually
export {
  UserModel,
  ProjectModel,
  ProjectMemberModel,
  TaskModel,
  TaskAssignmentModel,
  TaskCommentModel,
  TaskHistoryModel,
};
