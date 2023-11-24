const {
  catchAsync,
  notImplementedControllerResponse,
  JsonResponseGenerator,
  HTTP_STATUS_CODES,
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
        .status(HTTP_STATUS_CODES.OK)
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
      // TODO: implement login controller
      notImplementedControllerResponse(req, res);
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
      // TODO: implement getMe controller
      notImplementedControllerResponse(req, res);
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
      // TODO: implement updateMe controller
      notImplementedControllerResponse(req, res);
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
      // TODO: implement changeMyPassword controller
      notImplementedControllerResponse(req, res);
    }
  );
}

module.exports = { AuthController };
