import { DataTypes, Model, Sequelize } from 'sequelize';
import { TaskHistoryAttributes, TaskHistoryCreationAttributes } from './taskHistory.model.interface';

export class TaskHistoryModel extends Model<TaskHistoryAttributes, TaskHistoryCreationAttributes> implements TaskHistoryAttributes {
  public id!: string;
  public taskId!: string;
  public changedBy!: string;
  public changeType!: string;
  public oldValue!: string | null;
  public newValue!: string | null;
  public changedAt!: Date;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Static method to initialize the model
  public static initialize(sequelize: Sequelize): void {
    TaskHistoryModel.init(
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
        changedBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'changed_by',
          references: {
            model: 'users',
            key: 'id',
          },
        },
        changeType: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'change_type',
        },
        oldValue: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'old_value',
        },
        newValue: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'new_value',
        },
        changedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: 'changed_at',
        },
      },
      {
        sequelize,
        tableName: 'task_history',
        timestamps: true,
        underscored: true,
      }
    );
  }

  // Static method to set up associations
  public static associate(models: any): void {
    const { TaskModel, UserModel } = models;
    
    // Task history entry belongs to a task
    TaskHistoryModel.belongsTo(TaskModel, {
      foreignKey: 'taskId',
      as: 'task',
    });
    
    // Task history entry belongs to a user who made the change
    TaskHistoryModel.belongsTo(UserModel, {
      foreignKey: 'changedBy',
      as: 'user',
    });
  }
}
