import { check } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { handleValidator } from "../../../helpers";

export const validateRegister = [
  check("name")
    .notEmpty()
    .withMessage("The name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  
  check("email")
    .notEmpty()
    .withMessage("The email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  
  check("password")
    .notEmpty()
    .withMessage("The password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  
  (req: Request, res: Response, next: NextFunction) => {
    handleValidator(req, res, next);
  },
];
