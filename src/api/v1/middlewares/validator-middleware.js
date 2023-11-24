const {
  HTTP_STATUS_CODES,
  catchAsync,
  AppError,
} = require('../../../shared/helpers');

const { AUTH_VALIDATION_SCHEMA } = require('../validations');

/**
 * @constant {Object} VALIDATION_SCHEMA
 * @description Object contains all validation schemas for all endpoints.
 */
const VALIDATION_SCHEMA = Object.freeze({
  AUTH: AUTH_VALIDATION_SCHEMA,
});

/**
 * Generic validator middleware to validate request data against a schema based on the endpoint.
 * @param {'AUTH'} validationSchema Validation schema to use for the endpoint
 * @returns {async Function} Middleware function to validate request data against a schema based on the endpoint.
 */
const validate = (validationSchema) => {
  if (!validationSchema) {
    throw new AppError(
      'Validation schema is required!',
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }

  if (!Object.keys(VALIDATION_SCHEMA).includes(validationSchema)) {
    throw new AppError(
      'Invalid validation schema!',
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }

  return catchAsync(
    /**
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {Promise<void>}
     */
    async (req, res, next) => {
      // Extract the endpoint part from the URL path (e.g., '/register')
      const endpoint = req.path.split('/').pop();

      // Fetch the schema for the provided endpoint
      const schema = VALIDATION_SCHEMA[validationSchema][endpoint];

      if (!schema || req.method === 'GET' || req.method === 'DELETE') {
        return next();
      }

      // Validate the request body against the schema
      const { error, value } = schema.validate(req.body);

      // If there is an error, return it to the client
      if (error) {
        // Replace the double quotes in the error message
        const message = error.message.replace(/"/g, '');

        // Return the error to the client
        return next(new AppError(message, HTTP_STATUS_CODES.BAD_REQUEST));
      }

      // If there is no error, assign the validated value to the request body
      req.body = value;

      next();
    }
  );
};

module.exports = { validate };
