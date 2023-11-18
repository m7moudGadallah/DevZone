require('colors');
const express = require('express');

/**
 * Create Express app
 * @returns {import('express').Application} Express app
 */
function createApp() {
  // TODO: Initialize database connection

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
