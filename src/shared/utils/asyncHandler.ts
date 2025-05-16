import { Request, Response, NextFunction } from 'express';

/**
 * Envuelve un controlador asincrónico y pasa cualquier error al middleware global
 * 
 * @param fn Función controladora asincrónica
 * @returns Función controladora con manejo de errores
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error); // Pasa el error al middleware global
    }
  };
};
