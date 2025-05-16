import { Sequelize } from 'sequelize';
import { initializeModels } from '../../models';
import dotenv from 'dotenv-flow';

// Make sure environment variables are loaded
dotenv.config({ silent: true });

// Ensure we have default values in case environment variables are missing
const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';
const POSTGRES_PORT = process.env.POSTGRES_PORT || '5432';
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'postgres';
const POSTGRES_DB = process.env.POSTGRES_DB || 'nuam_technical';
const POSTGRES_SCHEMA = process.env.POSTGRES_SCHEMA || 'public';

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
    console.log("Connecting to PostgreSQL with:", {
      host: POSTGRES_HOST,
      port: POSTGRES_PORT,
      user: POSTGRES_USER,
      database: POSTGRES_DB,
      schema: POSTGRES_SCHEMA
    });
    
    // Initialize models before authenticating
    initializeModels(connection);
    await connection.authenticate();
    
    console.info('[DatabasePostgres]: Connection has been established successfully.');
    await connection.sync({ force: false, alter: true });
    console.info('[DatabasePostgres]: Models synchronized with database.');
    
    return connection;
  } catch (error) {
    let message = '[DatabasePostgres]: Unable to connect to the database:';
    console.error(`${message} ${error}`);
    throw new Error(`${message} ${error}`);
  }
};
