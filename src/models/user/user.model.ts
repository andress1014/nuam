import { DataTypes, Model, Sequelize } from 'sequelize';
import { UserAttributes, UserCreationAttributes } from './user.model.interface';
import bcrypt from 'bcrypt';

export class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public password_hash!: string;
  public role!: 'admin' | 'user';
  
  public readonly created_at!: Date;
  public readonly updatedAt!: Date;

  // Static method to initialize the model
  public static initialize(sequelize: Sequelize): void {
    UserModel.init(
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
          field: 'password_hash'
        },
        role: {
          type: DataTypes.STRING(20),
          allowNull: false,
          defaultValue: 'user',
          validate: {
            isIn: [['admin', 'user']],
          },
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
        },
      },
      {
        sequelize,
        tableName: 'users',
        timestamps: true,
        underscored: true,        hooks: {
          beforeCreate: async (user: UserModel) => {
            if (user.password_hash) {
              const salt = await bcrypt.genSalt(10);
              user.password_hash = await bcrypt.hash(user.password_hash, salt);
            }
          },
          beforeUpdate: async (user: UserModel) => {
            if (user.changed('password_hash')) {
              const salt = await bcrypt.genSalt(10);
              user.password_hash = await bcrypt.hash(user.password_hash, salt);
            }
          }
        }
      }
    );
  }

  // Static method to set up associations
  public static associate(models: any): void {
    // Will be implemented when other models are defined
  }
}
