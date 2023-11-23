const {
  HTTP_STATUS_CODES,
  AppError,
  catchAsync,
} = require('../../../shared/helpers');

const { AuthService } = require('../services');

/**
 * @class AuthMiddleware
 * @description Contains middleware functions for authentication and authorization
 */
class AuthMiddleware {
  /**
   * Middleware function to validate user is logged in.
   * @async
   */
  static authenticate = catchAsync(
    /**
     * @async
     * @param {import('express').Request} req - The Express.js request object.
     * @param {import('express').Response} res - The Express.js response object.
     * @param {import('express').NextFunction} next - The Express.js next middleware function.
     * @returns { promise<void>}
     */
    async (req, res, next) => {
      // 1) Check if token exists
      if (
        (!req?.headers?.authorization ||
          !req?.headers?.authorization?.startsWith('Bearer')) &&
        !req?.cookies?.jwt
      ) {
        next(
          new AppError(
            'You are not logged in! Please log in to get access.',
            HTTP_STATUS_CODES.UNAUTHORIZED
          )
        );
      } else {
        // Fetch token from header or cookie
        const token =
          req?.cookies?.jwt || req?.headers?.authorization?.split(' ')[1];

        // Verify token and Get user via token using the `getMeViaToken` method of the `AuthService` class
        const user = await AuthService.getMeViaToken(token);

        // Grant access to protected route
        req.locals = req.locals || {};
        req.locals.user = user;

        next();
      }
    }
  );

  /**
   * Middleware to authorize the endpoint.
   * @param  {...string} roles
   * @returns @returns {Function} - Express middleware function
   */
  static authorize =
    (...roles) =>
    /**
     *@async
     * @param {import('express').Request} req - The Express.js request object.
     * @param {import('express').Response} res - The Express.js response object.
     * @param {import('express').NextFunction} next - The Express.js next middleware function.
     * @returns {promise<void>}
     */
    (req, res, next) => {
      if (!roles.includes(req.locals.user.roles)) {
        return next(
          new AppError(
            'You do not have permission to perform this action',
            HTTP_STATUS_CODES.FORBIDDEN
          )
        );
      }
    };
}

module.exports = { AuthMiddleware };
