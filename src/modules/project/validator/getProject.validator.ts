import { param } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { handleValidator } from "../../../helpers";

export const validateGetProject = [
  param("id")
    .notEmpty()
    .withMessage("Project ID is required")
    .isUUID()
    .withMessage("Invalid project ID format"),
  
  (req: Request, res: Response, next: NextFunction) => {
    handleValidator(req, res, next);
  },
];
