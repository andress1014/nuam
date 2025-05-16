import { DataTypes, Model, Sequelize } from 'sequelize';

export class ProjectEntity extends Model {
  public id!: string;
  public name!: string;
  public description!: string | null;
  public owner_id!: string; // Campo según schema SQL proporcionado
  
  public readonly created_at!: Date;
  public readonly updatedAt!: Date;

  // Static method to initialize the model
  public static initialize(sequelize: Sequelize): void {
    ProjectEntity.init(
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
        owner_id: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'owner_id',
          references: {
            model: 'users',
            key: 'id',
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
        tableName: 'projects',
        timestamps: true,
        underscored: true,
      }
    );
  }
}
