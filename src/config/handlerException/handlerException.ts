import { Request, Response, NextFunction } from "express";

//**************** helpers ******************************//
import { handleError, AppError, HttpCode} from "../../helpers";
import logger from "../logger/logger";

/**
 * Realiza el mapeo de errores 
  * @param error clase de error capturado
  * @param req Request de la petición
  * @param res Respuesta de la petición
  * @param next Funcion para dar continuidad con la aplicación
 */
export const HandlerException = async (error: Error | AppError<any> | any, req: Request, res: Response, next: NextFunction) => {
    // Check if headers already sent to client
    if (res.headersSent) {
        return next(error);
    }

    let status = HttpCode.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let detailsError;

    try {        if (error instanceof AppError) {
            // Si es un AppError, usa sus propiedades
            status = error.status;
            message = error.message;
            detailsError = error.detailsError;
            
            logger.error('AppError captured:', { status, message, details: detailsError });        } else if (error instanceof Error) {
            // Si es un Error normal, usa su mensaje
            message = error.message || 'Unknown error occurred';
        } else if (typeof error === 'string') {
            // Si es un string, úsalo como mensaje
            message = error;
        }
          logger.error(`Error handling request to ${req.method} ${req.path}: ${message}`);
        
        if (error.stack) {
            logger.debug(error.stack);
        }
        
        handleError(res, status, message, detailsError);
    } catch (handlingError) {
        // In case the error handler itself throws an error
        logger.error('Error in error handler:', handlingError);
        res.status(500).json({
            status: HttpCode.INTERNAL_SERVER_ERROR,
            message: 'An unexpected error occurred while processing your request'
        });
    }
}
