/**
 * @typedef {Object} CookieOptions
 * @property {Date} expires - The expiration date of the cookie.
 * @property {boolean} httpOnly - Indicates whether the cookie should only be accessed through HTTP requests.
 * @property {boolean} secure - Indicates whether the cookie should only be sent over secure (HTTPS) connections.
 */

/**
 * @typedef {Object} Payload
 * @property {string} [token] - The JWT token.
 * @property {string} [otp] - The OTP.
 * @property {Data} [data] - The data to be sent.
 */

/**
 * @typedef {Object} Data
 * @property {Object|Array<Object>} item - A single item or an array of items.
 * @property {number} [count] - The number of items in the array.
 * @property {Pagination} [pagination] - The pagination data.
 */

/**
 * @typedef {Object} Pagination
 * @property {{page: number, pageSize: number}} [prev] - The previous page.
 * @property {{page: number, pageSize: number}} [next] - The next page.
 */

/**
 * @typedef {Object} ResponseError
 * @property {string} status - The status of the error (e.g. fail, error).
 * @property {string} message - The error message.
 */

/**
 * @class
 * @description A class that generates json response objects.
 */
class JsonResponseGenerator {
  /**
   * Generates options for a cookie.
   *
   * @param {number} expiresIn - The number of seconds before the cookie expires.
   * @param {boolean} [secure=false] - Indicates if the cookie should be secure.
   * @returns {CookieOptions} Cookie options.
   */
  static generateCookieOptions(expiresIn, secure = false) {
    return {
      expires: new Date(Date.now() + expiresIn),
      httpOnly: true,
      secure,
    };
  }

  /**
   * Generates JSON response object for success responses.
   * @param {string} message - The message to be sent.
   * @param {Payload} [payload] - An object containing the payload to be sent.
   * @returns {{success: true, message: string, payload?: Payload}} The json response object.
   */
  static generateSuccessResponse(message, payload) {
    return {
      success: true,
      message,
      payload,
    };
  }

  /**
   * Generates JSON response object for error responses.
   * @param {ResponseError} error
   * @returns {{success: false, message: 'Something went wrong!', error: ResponseError}} The json response object.
   */
  static generateErrorResponse(error) {
    return {
      success: false,
      message: 'Something went wrong!',
      error,
    };
  }
}

module.exports = { JsonResponseGenerator };
