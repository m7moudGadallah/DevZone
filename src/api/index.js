require('colors');
const express = require('express');
const { DATABASE_CONFIG, Database } = require('../config');
const {
  HTTP_STATUS_CODES,
  JsonResponseGenerator,
} = require('../shared/helpers');
const {
  loadPreMiddlewares,
  loadPostMiddlewares,
} = require('../shared/middlewares');
const { loadV1Routes } = require('./v1');

/**
 * Create Express app
 * @returns {import('express').Application} Express app
 */
function createApp() {
  // Create database instance
  Database.getInstance(DATABASE_CONFIG.URL);

  console.log(
    '('.cyan.underline.bold.italic +
      `${DATABASE_CONFIG.NAME}`.brightYellow.underline.bold.italic +
      ') Database Connected 🚀...'.cyan.underline.bold.italic
  );

  // Create Express app
  const app = express();

  loadPreMiddlewares(app);

  // Mount API monitoring routes
  app.get('/livez', (req, res) => {
    const response = JsonResponseGenerator.generateSuccessResponse(
      'Server is running🚀...'
    );
    res.status(HTTP_STATUS_CODES.OK).json(response);
  });

  // Load API v1 routes
  loadV1Routes(app);

  loadPostMiddlewares(app);

  return app;
}

module.exports = { createApp };
