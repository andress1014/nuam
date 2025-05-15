import { Request, Response } from "express";

import app from "./src/config/app";
import logger from "./src/config/logger/logger"
import { DBPostgres } from './src/config/postgres/postgres-sequelize';
import { HandlerException } from "./src/config/handlerException/handlerException";
import { Logger } from "winston";

// Use port from environment or default to 3000
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
  // Continue even if database connection fails
}

// Handler for exceptions in Express routes
app.use(HandlerException);

// Create HTTP server with error handling
const server = app.listen(port, () => {
  log.info(`[Server]: is running on port http://localhost:${port}`);
});

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    log.error(`Port ${port} is already in use. Trying to use a different port...`);
    // Try a different port
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
