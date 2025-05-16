import { Request, Response, NextFunction } from "express";
import { handleValidator } from "../../../helpers";

export const validateProfile = [
  // Since this is a GET endpoint that only relies on the JWT token for authentication,
  // we don't need to validate any inputs from the request body
  
  (req: Request, res: Response, next: NextFunction) => {
    handleValidator(req, res, next);
  },
];
