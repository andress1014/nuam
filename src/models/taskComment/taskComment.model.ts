import { DataTypes, Model, Sequelize } from 'sequelize';
import { TaskCommentAttributes, TaskCommentCreationAttributes } from './taskComment.model.interface';

export class TaskCommentModel extends Model<TaskCommentAttributes, TaskCommentCreationAttributes> implements TaskCommentAttributes {
  public id!: string;
  public taskId!: string;
  public userId!: string;
  public comment!: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Static method to initialize the model
  public static initialize(sequelize: Sequelize): void {
    TaskCommentModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        taskId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'task_id',
          references: {
            model: 'tasks',
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
        comment: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
      },
      {
        sequelize,
        tableName: 'task_comments',
        timestamps: true,
        underscored: true,
      }
    );
  }

  // Static method to set up associations
  public static associate(models: any): void {
    const { TaskModel, UserModel } = models;
    
    // Task comment belongs to a task
    TaskCommentModel.belongsTo(TaskModel, {
      foreignKey: 'taskId',
      as: 'task',
    });
    
    // Task comment belongs to a user
    TaskCommentModel.belongsTo(UserModel, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}
