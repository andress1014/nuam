import { Application, Request, Response, NextFunction } from "express";

//**************** helpers ******************************//
import { handleError, AppError, HttpCode} from "../../helpers";

/**
 * Realiza el mapeo de errores 
  * @param error clase de error capturado
  * @param req Request de la petición
  * @param res Respuesta de la petición
  * @param next Funcion para dar continuidad con la aplicación
 */
export const HandlerException = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    // Check if headers already sent to client
    if (res.headersSent) {
        return next(error);
    }

    let status = HttpCode.INTERNAL_SERVER_ERROR;
    let detailsError;

    try {
        if (error instanceof AppError) {
            status = error.status;
            detailsError = error.detailsError;
        }
        
        log.error(`Error handling request to ${req.method} ${req.path}: ${error.message}`);
        
        if (error.stack) {
            log.debug(error.stack);
        }
        
        handleError(res, status, error.message, detailsError);
    } catch (handlingError) {
        // In case the error handler itself throws an error
        console.error('Error in error handler:', handlingError);
        res.status(500).json({
            status: HttpCode.INTERNAL_SERVER_ERROR,
            message: 'An unexpected error occurred while processing your request'
        });
    }
}
