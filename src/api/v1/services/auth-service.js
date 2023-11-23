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
    // TODO: implement signup service
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
