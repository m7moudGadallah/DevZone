const { HTTP_STATUS_CODES } = require('./http-status-codes');
const { JsonResponseGenerator } = require('./json-response-generator');

/**
 * Controller function for handling unimplemented routes yet.
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @returns {void}
 */
function notImplementedControllerResponse(req, res) {
  const response = JsonResponseGenerator.generateSuccessResponse(
    `This route [${req.path}] is not implemented yet`
  );
  res.status(HTTP_STATUS_CODES.NOT_IMPLEMENTED).json(response);
}

module.exports = { notImplementedControllerResponse };
