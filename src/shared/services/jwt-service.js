const jwt = require('jsonwebtoken');
const { AppError, HTTP_STATUS_CODES } = require('../helpers');

/**
 * @typedef tokenPayload
 * @property {string} id  User Id
 * @property {number} iat Issued At
 * @property {number} exp Expiration Time
 */

/**
 * @class JWTService
 * @classdesc A service for generating and decoding JWT (JSON Web Token) tokens.
 */
class JWTService {
  /**
   * Generates a JWT token with the provided user id.
   * @param {string} id The id of the user to be included in the JWT payload.
   * @returns {string} the generated JWT token.
   */
  static generate(id) {
    const jwtToken = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_IN,
    });

    return jwtToken;
  }

  /**
   * Decodes a JWT token.
   * @param {string} token - The JWT token to be decoded.
   * @returns {tokenPayload} The decoded payload if the token is valid.
   */
  static decode(token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      return decodedToken;
    } catch (err) {
      throw new AppError(
        'Unauthorized, Please Login again to get access',
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }
  }
}

module.exports = { JWTService };
