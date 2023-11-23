const morgan = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

/**
 * Load pre-middlewares to an Express application for enhanced security and functionality.
 * @function
 * @param {import('express').Application} app The Express application to which the middlewares should be applied.
 * @returns {void}
 */
function loadPreMiddlewares(app) {
  // Set Security http headers
  app.use(helmet());

  // Log requested endpoints in development mode
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Parse JSON bodies
  app.use(express.json({ limit: '10kb' }));

  // Parse cookies
  app.use(cookieParser());

  // Parse cookies
  app.use(cookieParser());

  const { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MIN } = process.env;
  // API rate-Limit using express-rate-limit
  const limiter = rateLimit({
    max: RATE_LIMIT_MAX,
    windowMs: Number(RATE_LIMIT_WINDOW_MIN) * 60 * 1000,
    message: {
      status: 'Error',
      message: 'Too many requests from this IP, please try again in an hour!',
    },
  });

  // Apply API rate limiting to the '/api' endpoint.
  app.use('/api', limiter);

  // Data sanitization against XSS
  app.use(xss());

  // Prevent parameter pollution
  app.use(hpp());

  // Enable CORS
  app.use(cors());
}

module.exports = { loadPreMiddlewares };
