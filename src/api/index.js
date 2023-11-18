require('colors');
const express = require('express');
const { DATABASE_CONFIG, Database } = require('../config');

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

  // TODO: Mount Pre-Middlewares

  // Mount API monitoring routes
  app.get('/livez', (req, res) =>
    res.status(200).json({
      success: true,
      message: 'Server is running🚀...',
    })
  );

  // TODO: Mount API routes

  // TODO: Mount Post-Middlewares

  return app;
}

module.exports = { createApp };
