import { Request, Response, NextFunction } from "express";
import { handleValidator } from "../../../helpers";

export const validateProfile = [
    (req: Request, res: Response, next: NextFunction) => {
    handleValidator(req, res, next);
  },
];
