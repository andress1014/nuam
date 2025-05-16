import { Request, Response, NextFunction } from "express";
import { handleValidator } from "../../../helpers";

export const validateGetUserProjects = [
  // No se requieren parámetros específicos para validar, ya que el usuario se identifica por el token
  (req: Request, res: Response, next: NextFunction) => {
    handleValidator(req, res, next);
  },
];
