const { HTTP_STATUS_CODES } = require('./http-status-codes');

/**
 * AppError class is used to throw custom application errors
 */
class AppError extends Error {
  /**
   *
   * @param {string} message error message by default 'Something went wrong'
   * @param {number} statusCode HTTP status code by default 500
   */
  constructor(
    message = 'Something went wrong',
    statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { AppError };
