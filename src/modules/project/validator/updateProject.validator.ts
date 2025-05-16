import { check, param } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { handleValidator } from "../../../helpers";

export const validateUpdateProject = [
  param("id")
    .notEmpty()
    .withMessage("Project ID is required")
    .isUUID()
    .withMessage("Invalid project ID format"),
  
  check("name")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Project name must be between 3 and 100 characters long"),
  
  check("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  
  (req: Request, res: Response, next: NextFunction) => {
    handleValidator(req, res, next);
  },
];
