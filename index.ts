import { Request, Response } from "express";
import { EventEmitter } from 'events';
import * as dotenv from 'dotenv-flow';

// Load environment variables from .env files
dotenv.config();

EventEmitter.defaultMaxListeners = 20;

import app from "./src/config/app";
import logger from "./src/config/logger/logger"
import { DBPostgres } from './src/config/postgres/postgres-sequelize';
import { HandlerException } from "./src/config/handlerException/handlerException";
import { Logger } from "winston";

const port = process.env.PORT || 3000;

declare global {
  var log: Logger;
}
global.log = logger;

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application continues running despite unhandled promise rejections
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
  log.error('Uncaught Exception:', error);
  log.error(error.stack || 'No stack trace available');
  // Application continues running despite uncaught exceptions
});

// Set up database connection but don't crash if it fails
try {
  DBPostgres();
} catch (error) {
  log.error('Failed to connect to database:', error);
}

app.use(HandlerException);

const server = app.listen(port, () => {
  log.info(`[Server]: is running on port http://localhost:${port}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    log.error(`Port ${port} is already in use. Trying to use a different port...`);
    server.close();
    app.listen(0, () => {
      const address = server.address();
      const newPort = typeof address === 'object' && address ? address.port : null;
      log.info(`[Server]: is now running on port http://localhost:${newPort}`);
    });
  } else {
    log.error('Server error:', error);
  }
});
