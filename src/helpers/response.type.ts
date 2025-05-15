/**
 * Codigo de estado respuestas api rest
 */
export enum HttpCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 *  Estructura respuesta exitosa
 */
export type ResponseApi<T> = {
  status: HttpCode;
  data: T;
};

/**
 * Estructura de error de negocio
 */
export type AppErrorArgs<T> = {
  status?: HttpCode;
  message: string;
  detailsError?: T;
};

/**
 * Clase encargada de mapear los errores de negocio
 * @typedef {object} ServerError
 * @property {number} status.required - Código de respuesta de error
 * @property {string} message.required - Descripción del error
 */
/**
 * Clase encargada de mapear los errores de negocio
 * @typedef {object} AppError
 * @property {number} status.required - Código de respuesta de error
 * @property {string} message.required - Descripción del error
 * @property {object} detailsError - Detalle del error
 */
export class AppError<T> extends Error {
  public readonly status: HttpCode;
  public readonly detailsError?: T;

  constructor(args: AppErrorArgs<T>) {
    super(args.message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.detailsError = args.detailsError;
    this.status = args.status ? args.status : HttpCode.BAD_REQUEST;

    Error.captureStackTrace(this);
  }
}
