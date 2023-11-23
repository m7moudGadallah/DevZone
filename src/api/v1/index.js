const { V1Router } = require('./routes');

/**
 * Load API v1 routes
 * @param {import('express').Application} app The Express application to which the middlewares should be applied.
 * @returns {void}
 */
function loadV1Routes(app) {
  app.use('/api/v1', V1Router);
}

module.exports = { loadV1Routes };
