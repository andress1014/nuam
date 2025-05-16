import { Sequelize } from 'sequelize';
import { initializeModels } from '../../models';

const {
  POSTGRES_HOST = 'localhost',
  POSTGRES_PORT = 5432,
  POSTGRES_USER = 'postgres',
  POSTGRES_PASSWORD = 'postgres',
  POSTGRES_DB = 'nuam',
  POSTGRES_SCHEMA = 'public',
}: any = process.env;

/**
 * Configuracion de ORM
 */
export const connection = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
  host: POSTGRES_HOST,
  dialect: 'postgres',
  port: parseInt(POSTGRES_PORT),
  logging: false,
  schema: POSTGRES_SCHEMA,
  define: {
    timestamps: true,
    underscored: true,
  },
  sync: { force: false }, // Setting to false for production safety - use migrations instead
});

/**
 * Configuración de conección a Postgres
 */
export const DBPostgres = async () => {
  try {
    initializeModels(connection);    await connection.authenticate();
    log.info('[DatabasePostgres]: Connection has been established successfully.');
    await connection.sync({ force: false, alter: true });
    log.info('[DatabasePostgres]: Models synchronized with database.');
    
    return connection;
  } catch (error) {
    let message = '[DatabasePostgres]: Unable to connect to the database:';
    log.error(`${message} ${error}`);
    throw new Error(message);
  }
};
