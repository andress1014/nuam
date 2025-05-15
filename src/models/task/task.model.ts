import { DataTypes, Model, Sequelize } from 'sequelize';
import { TaskAttributes, TaskCreationAttributes } from './task.model.interface';

export class TaskModel extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: string;
  public projectId!: string;
  public title!: string;
  public description!: string | null;
  public status!: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  public dueDate!: Date | null;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Static method to initialize the model
  public static initialize(sequelize: Sequelize): void {
    TaskModel.init(
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
        title: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING(20),
          allowNull: false,
          defaultValue: 'pending',
          validate: {
            isIn: [['pending', 'in_progress', 'review', 'completed', 'cancelled']],
          },
        },
        dueDate: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          field: 'due_date',
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
      },
      {
        sequelize,
        tableName: 'tasks',
        timestamps: true,
        underscored: true,
      }
    );
  }

  // Static method to set up associations
  public static associate(models: any): void {
    const { ProjectModel, TaskAssignmentModel, TaskCommentModel, TaskHistoryModel } = models;
    
    // Task belongs to a project
    TaskModel.belongsTo(ProjectModel, {
      foreignKey: 'projectId',
      as: 'project',
    });
    
    // Task has many task assignments
    TaskModel.hasMany(TaskAssignmentModel, {
      foreignKey: 'taskId',
      as: 'assignments',
    });
    
    // Task has many comments
    TaskModel.hasMany(TaskCommentModel, {
      foreignKey: 'taskId',
      as: 'comments',
    });
    
    // Task has many history entries
    TaskModel.hasMany(TaskHistoryModel, {
      foreignKey: 'taskId',
      as: 'history',
    });
  }
}
