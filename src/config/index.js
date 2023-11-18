const dotenv = require('dotenv');
const { Database } = require('./database');

const configEnv = `${__dirname}/../../.env`;
dotenv.config({ path: configEnv }); // Load environment variables

// Database configuration

/**
 * Choose the database URL based on the environment
 * @returns {string} Database URL
 */
const selectDatabase = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.DATABASE_URL_PROD;
  }
  if (process.env.NODE_ENV === 'testing') {
    return process.env.DATABASE_URL_TEST;
  }
  return process.env.DATABASE_URL_DEV;
};

/**
 * Database configuration
 * @type {{URL: string, NAME: string}}}
 * @property {string} URL - Database URL
 * @property {string} NAME - Database name
 */
const DATABASE_CONFIG = Object.freeze({
  URL: selectDatabase(),
  NAME: selectDatabase().split('/').pop(),
});

// Initialize database
Database.getInstance(DATABASE_CONFIG.URL);

module.exports = { DATABASE_CONFIG, Database };
