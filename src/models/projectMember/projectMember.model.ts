import { DataTypes, Model, Sequelize } from 'sequelize';
import { ProjectMemberAttributes, ProjectMemberCreationAttributes } from './projectMember.model.interface';

export class ProjectMemberModel extends Model<ProjectMemberAttributes, ProjectMemberCreationAttributes> implements ProjectMemberAttributes {
  public id!: string;
  public projectId!: string;
  public userId!: string;
  public role!: 'owner' | 'editor' | 'viewer';
  public addedAt!: Date;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Static method to initialize the model
  public static initialize(sequelize: Sequelize): void {
    ProjectMemberModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        projectId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'project_id',
          references: {
            model: 'projects',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'user_id',
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        role: {
          type: DataTypes.STRING(10),
          allowNull: false,
          validate: {
            isIn: [['owner', 'editor', 'viewer']],
          },
        },
        addedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: 'added_at',
        },
      },
      {
        sequelize,
        tableName: 'project_members',
        timestamps: true,
        underscored: true,
        indexes: [
          {
            unique: true,
            fields: ['project_id', 'user_id'],
          },
        ],
      }
    );
  }

  // Static method to set up associations
  public static associate(models: any): void {
    const { ProjectModel, UserModel } = models;
    
    // Project member belongs to a project
    ProjectMemberModel.belongsTo(ProjectModel, {
      foreignKey: 'projectId',
      as: 'project',
    });
    
    // Project member belongs to a user
    ProjectMemberModel.belongsTo(UserModel, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}
