import express, { Application, Request, Response, NextFunction } from "express";

const app: Application = express();
import bodyParser from "body-parser";
import environment from "dotenv-flow";
import cors from "cors";
import morgan from "morgan";
import { UserRouter } from "../modules/user/routes";
import { ProjectRoutes } from "../modules/project/routes";
import { HandlerException } from "./handlerException/handlerException";

environment.config({ silent: true });
const api = process.env.API_URL || "/api/v1";

app.use(cors());

app.use(morgan("dev"));

//Body Parser - Move this before routes
app.use(bodyParser.json({ limit: "5mb", type: "application/json" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

// Health check endpoint - useful for monitoring
app.use("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString()
  });
});

// User
app.use("/api/v1/user", UserRouter);

// Project
app.use("/api/v1/projects", ProjectRoutes);

// Tasks
import { TaskRoutes } from "../modules/task/routes";
app.use("/api/v1/tasks", TaskRoutes);

// Middleware para manejar errores 404
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  res.status(404);
  next(error);
});

// Middleware global para capturar todos los errores de la aplicación
app.use(HandlerException);

export default app;
