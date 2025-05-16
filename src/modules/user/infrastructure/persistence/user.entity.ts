import { DataTypes, Model, Sequelize } from 'sequelize';

export class UserEntity extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public password_hash!: string;
  
  public readonly created_at!: Date;
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
        },        password_hash: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'password_hash',
        },
        created_at: {
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
