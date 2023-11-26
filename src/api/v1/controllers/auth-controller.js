const {
  catchAsync,
  notImplementedControllerResponse,
  JsonResponseGenerator,
  HTTP_STATUS_CODES,
  AppError,
} = require('../../../shared/helpers');
const { AuthService } = require('../services');

class AuthController {
  /**
   * @route POST /api/v1/auth/signup
   * @access public
   * @description Register a new user
   */
  static signup = catchAsync(
    /**
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    async (req, res, next) => {
      const { username, password } = req.body;

      const token = await AuthService.signup(username, password);

      const cookieOptions = JsonResponseGenerator.generateCookieOptions(
        +process.env.COOKIE_EXPIRES_IN
      );

      const response = JsonResponseGenerator.generateSuccessResponse(
        'Registration Successful! Welcome aboard!',
        {
          token,
        }
      );

      res
        .status(HTTP_STATUS_CODES.CREATED)
        .cookie('jwt', token, cookieOptions)
        .json(response);
    }
  );

  /**
   * @route POST /api/v1/auth/login
   * @access public
   * @description Login a user
   */
  static login = catchAsync(
    /**
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    async (req, res, next) => {
      const { username, password } = req.body;

      const token = await AuthService.login(username, password);

      const cookieOptions = JsonResponseGenerator.generateCookieOptions(
        +process.env.COOKIE_EXPIRES_IN
      );

      const response = JsonResponseGenerator.generateSuccessResponse(
        'Logged in Successfully!',
        {
          token,
        }
      );

      res
        .status(HTTP_STATUS_CODES.OK)
        .cookie('jwt', token, cookieOptions)
        .json(response);
    }
  );

  /**
   * @route GET /api/v1/auth/me
   * @access private
   * @description Get user data
   */
  static getMe = catchAsync(
    /**
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    async (req, res, next) => {
      const { id, username, email, about } = req.locals.user;

      const response = JsonResponseGenerator.generateSuccessResponse(
        'Account data retrieved successfully',
        {
          data: {
            user: {
              id,
              username,
              email,
              about,
            },
          },
        }
      );

      res.status(HTTP_STATUS_CODES.OK).json(response);
    }
  );

  /**
   * @route PATCH /api/v1/auth/me
   * @access private
   * @description Update user data
   */
  static updateMe = catchAsync(
    /**
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    async (req, res, next) => {
      const { id } = req.locals.user;
      const data = req.body;

      if (!data || !Object.keys(data).length)
        throw new AppError(
          'There is no data to be updated',
          HTTP_STATUS_CODES.BAD_REQUEST
        );

      const { username, email, about } = await AuthService.updateMe(id, data);

      const response = JsonResponseGenerator.generateSuccessResponse(
        'Account data updated successfully',
        {
          data: {
            user: {
              id,
              username,
              email,
              about,
            },
          },
        }
      );

      res.status(HTTP_STATUS_CODES.OK).json(response);
    }
  );

  /**
   * @route POST /api/v1/auth/change-my-password
   * @access private
   * @description Change user password
   */
  static changeMyPassword = catchAsync(
    /**
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    async (req, res, next) => {
      const { password, newPassword } = req.body;

      const updatedUser = await AuthService.changePassword(
        req.locals.user,
        password,
        newPassword
      );
      req.locals.user = updatedUser;

      const response = JsonResponseGenerator.generateSuccessResponse(
        'Password changed successfully'
      );

      res.status(HTTP_STATUS_CODES.OK).json(response);
    }
  );
}

module.exports = { AuthController };
