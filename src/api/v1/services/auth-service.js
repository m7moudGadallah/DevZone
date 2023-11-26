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
    // Validate parameters
    if (!username || !password)
      throw new AppError(
        'Some missing parameters',
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      );

    const DB = Database.getInstance();

    // Fetch user from database
    const user = await DB.user.findUnique({
      where: {
        username,
      },
    });

    // Validate that user is exists
    if (!user) {
      throw new AppError(
        'Invalid email or password',
        HTTP_STATUS_CODES.FORBIDDEN
      );
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError(
        'Invalid email or password',
        HTTP_STATUS_CODES.FORBIDDEN
      );
    }

    // Generate JWT Token
    const token = JWTService.generate(user.id);

    // return token
    return token;
  }

  /**
   * @HelperFunction Check if user changed password after jwt token issued
   * @access private
   * @param {Date} passwordChangedAt Date that last time password changed
   * @param {number} jwtIAT issued date of jwt
   * @returns {boolean} true if password is changed after token is issued so it's an expired token, otherwise false
   */
  static isPasswordChangedAfter(passwordChangedAt, jwtIAT) {
    // Validate parameters
    if (!passwordChangedAt || !jwtIAT)
      throw new AppError(
        'Some missing parameters',
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      );

    // passwordChangedAt -> timestamp in milliseconds
    const passwordChangedAtTimestamp = passwordChangedAt.getTime() / 1000;

    return jwtIAT < passwordChangedAtTimestamp;
  }

  /**
   * Get user data using JWT token
   * @async
   * @param {string} token JWT token
   * @returns {Promise<import('@prisma/client').User>} User data
   */
  static async getMeViaToken(token) {
    // Validate parameters
    if (!token)
      throw new AppError(
        'Some missing parameters',
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      );

    // Decode token
    const decodedToken = JWTService.decode(token);

    // Validate that token is not expired
    if (decodedToken.exp < Date.now() / 1000)
      throw new AppError('Invalid token', HTTP_STATUS_CODES.UNAUTHORIZED);

    // Validate that user id is valid
    const DB = Database.getInstance();

    const user = await DB.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    if (!user)
      throw new AppError('Invalid token', HTTP_STATUS_CODES.UNAUTHORIZED);

    // Validate that token is not Issued before password is changed
    if (
      user.passwordChangedAt &&
      AuthService.isPasswordChangedAfter(
        user.passwordChangedAt,
        decodedToken.iat
      )
    )
      throw new AppError('Invalid token', HTTP_STATUS_CODES.UNAUTHORIZED);

    return user;
  }

  /**
   * Update user data
   * @async
   * @param {string} id user id
   * @param {{email?: string, about?: string}} data
   * @returns {Promise<import('@prisma/client').User>} User data
   */
  static async updateMe(id, data) {
    // Validate parameters
    if (!id || !data)
      throw new AppError(
        'Some missing parameters',
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      );

    // Update user data
    const DB = Database.getInstance();

    const updatedUser = await DB.user.update({
      where: {
        id,
      },
      data,
    });

    return updatedUser;
  }

  /**
   * Change user password
   *@async
   * @param {import('@prisma/client').User} user user object from request locals
   * @param {string} password current password
   * @param {string} newPassword new password
   * @returns {Promise<import('@prisma/client').User>} updated User
   */
  static async changePassword(user, password, newPassword) {
    // Validate parameters
    if (!user || !user.password || !password || !newPassword)
      throw new AppError(
        'Some missing parameters',
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      );

    // Validate current password
    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch)
      throw new AppError('Wrong password!', HTTP_STATUS_CODES.FORBIDDEN);

    // Hash password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update user password
    const DB = Database.getInstance();
    const updatedUser = await DB.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: passwordHash,
        passwordChangedAt: new Date(Date.now()),
      },
    });

    return updatedUser;
  }
}

module.exports = { AuthService };
