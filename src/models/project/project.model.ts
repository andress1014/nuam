import { DataTypes, Model, Sequelize } from 'sequelize';
import { ProjectAttributes, ProjectCreationAttributes } from './project.model.interface';

export class ProjectModel extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: string;
  public name!: string;
  public description!: string | null;
  public createdBy!: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Static method to initialize the model
  public static initialize(sequelize: Sequelize): void {
    ProjectModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
          references: {
            model: 'users',
            key: 'id',
          },
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
      },
      {
        sequelize,
        tableName: 'projects',
        timestamps: true,
        underscored: true,
      }
    );
  }

  // Static method to set up associations
  public static associate(models: any): void {
    const { UserModel, ProjectMemberModel } = models;
    
    // Project belongs to a user who created it
    ProjectModel.belongsTo(UserModel, {
      foreignKey: 'createdBy',
      as: 'creator',
    });
    
    // Project has many project members
    ProjectModel.hasMany(ProjectMemberModel, {
      foreignKey: 'projectId',
      as: 'members',
    });
  }
}
