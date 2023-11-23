const {
  undefinedRoutesErrorHandler,
  globalErrorHandler,
} = require('../error-handlers');

/**
 * Load post-middlewares to an Express application for error handling.
 * @param {import('express').Application} app The Express application to which the middlewares should be applied.
 * @returns {void}
 */
function loadPostMiddlewares(app) {
  // error handling for undefined routes
  app.all('*', undefinedRoutesErrorHandler);

  // global error handling
  app.use(globalErrorHandler);
}

module.exports = { loadPostMiddlewares };
