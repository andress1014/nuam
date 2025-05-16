import { check } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { handleValidator } from "../../../helpers";

export const validateLogin = [
  check("email")
    .notEmpty()
    .withMessage("The email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  
  check("password")
    .notEmpty()
    .withMessage("The password is required"),
  
  (req: Request, res: Response, next: NextFunction) => {
    handleValidator(req, res, next);
  },
];