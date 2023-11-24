const bcrypt = require('bcryptjs');
const { Database } = require('../../../config');
const { AppError, HTTP_STATUS_CODES } = require('../../../shared/helpers');
const { JWTService } = require('../../../shared/services');

/**
 * @class AuthService
 * @description Auth service to handle all auth related services
 */
class AuthService {
  /**
   * Signup new user
   * @async
   * @param {string} username
   * @param {string} password
   * @returns {Promise<string>} JWT token
   */
  static async signup(username, password) {
    // Validate parameters
    if (!username || !password)
      throw new AppError(
        'Some missing parameters',
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      );

    const DB = Database.getInstance();

    // Validate username is not already exist
    let user = await DB.user.findUnique({
      where: {
        username,
      },
    });

    if (user)
      throw new AppError(
        'This username is already exist',
        HTTP_STATUS_CODES.FORBIDDEN
      );

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user in database
    user = await DB.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // Generate JWT Token
    const token = JWTService.generate(user.id);

    // Return JWT Token
    return token;
  }

  /**
   * Login User
   * @async
   * @param {string} username
   * @param {string} password
   * @returns {Promise<string>} JWT token
   */
  static async login(username, password) {
    // TODO: implement login service
  }

  /**
   * Get user data using JWT token
   * @async
   * @param {string} token JWT token
   * @returns {Promise<import('@prisma/client').User>} User data
   */
  static async getMeViaToken(token) {
    // TODO: implement getMeViaToken service
  }

  /**
   * Update user data
   * @async
   * @param {string} username
   * @param {{username?: string, email?: string, about?: string, }} data
   * @returns {Promise<import('@prisma/client').User>} User data
   */
  static async updateMe(username, data) {
    // TODO: implement updateMe service
  }

  /**
   * Change user password
   *@async
   * @param {string} username
   * @param {string} oldPassword
   * @param {string} newPassword
   * @returns {Promise<void>}
   */
  static async changePassword(username, oldPassword, newPassword) {
    // TODO: implement changePassword service
  }
}

module.exports = { AuthService };
