const { AppError, HTTP_STATUS_CODES } = require('../helpers');

/**
 * Middleware to handle undefined routes by generating a 404 error.
 * @function
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {void}
 */
function undefinedRoutesErrorHandler(req, res, next) {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      HTTP_STATUS_CODES.NOT_FOUND
    )
  );
}

module.exports = { undefinedRoutesErrorHandler };
