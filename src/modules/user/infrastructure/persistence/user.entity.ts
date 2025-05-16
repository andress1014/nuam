import { DataTypes, Model, Sequelize } from 'sequelize';

export class UserEntity extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Static method to initialize the model
  public static initialize(sequelize: Sequelize): void {
    UserEntity.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: 'updated_at',
        }
      },
      {
        sequelize,
        tableName: 'users',
        timestamps: true,
        underscored: true,
      }
    );
  }
}
