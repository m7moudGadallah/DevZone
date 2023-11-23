const {
  JsonResponseGenerator,
  AppError,
  HTTP_STATUS_CODES,
} = require('../helpers');

/**
 * Sends error response in production environment.
 * @function sendErrorProd
 * @param {AppError} error
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {void}
 */
function sendErrorProd(error, req, res) {
  // Log error in console
  console.error('ERROR 💥', error);

  if (error.isOperational) {
    const response = JsonResponseGenerator.generateErrorResponse(error);

    res.status(error.statusCode).json(response);
  } else {
    const response = JsonResponseGenerator.generateErrorResponse({
      status: 'error',
      message: 'Something went very wrong!',
    });

    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(response);
  }
}

/**
 * Sends error response in development environment.
 * @function sendErrorDev
 * @param {AppError} error
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {void}
 */
function sendErrorDev(error, req, res) {
  // Log error in console
  const response = JsonResponseGenerator.generateErrorResponse(error);

  res.status(error.statusCode).json(response);
}

/**
 * Global error handler middleware.
 * @function
 * @param {AppError} error
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {void}
 */
function globalErrorHandler(error, req, res, next) {
  error.statusCode =
    error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  error.status = error.status || 'error';

  if (process.env?.NODE_ENV === 'production') sendErrorProd(error, req, res);
  else sendErrorDev(error, req, res);
}

module.exports = { globalErrorHandler };
