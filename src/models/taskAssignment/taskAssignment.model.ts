import { DataTypes, Model, Sequelize } from 'sequelize';
import { TaskAssignmentAttributes, TaskAssignmentCreationAttributes } from './taskAssignment.model.interface';

export class TaskAssignmentModel extends Model<TaskAssignmentAttributes, TaskAssignmentCreationAttributes> implements TaskAssignmentAttributes {
  public id!: string;
  public taskId!: string;
  public userId!: string;
  public assignedAt!: Date;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Static method to initialize the model
  public static initialize(sequelize: Sequelize): void {
    TaskAssignmentModel.init(
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
        assignedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: 'assigned_at',
        },
      },
      {
        sequelize,
        tableName: 'task_assignments',
        timestamps: true,
        underscored: true,
        indexes: [
          {
            unique: true,
            fields: ['task_id', 'user_id'],
          },
        ],
      }
    );
  }

  // Static method to set up associations
  public static associate(models: any): void {
    const { TaskModel, UserModel } = models;
    
    // Task assignment belongs to a task
    TaskAssignmentModel.belongsTo(TaskModel, {
      foreignKey: 'taskId',
      as: 'task',
    });
    
    // Task assignment belongs to a user
    TaskAssignmentModel.belongsTo(UserModel, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}
