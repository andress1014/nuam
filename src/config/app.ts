import express, { Application, Request, Response, NextFunction } from "express";

const app: Application = express();
import bodyParser from "body-parser";
import environment from "dotenv-flow";
import cors from "cors";
import morgan from "morgan";

environment.config({ silent: true });

app.use(cors());

app.use(morgan("dev"));

// Health check endpoint - useful for monitoring
app.use("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString()
  });
});

//Body Parser
app.use(bodyParser.json({ limit: "5mb", type: "application/json" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));


export default app;
