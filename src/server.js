const http = require('http');
require('colors');
require('./config');
const { createApp } = require('./api');

/**
 * HTTP Server class
 */
class Server {
  static #httpServerInstance = null;

  /**
   * Initialize the HTTP server
   * @param {import('express').Application} app Express app
   * @returns {http.Server} HTTP server
   */
  static initialize(app) {
    if (Server.#httpServerInstance) return Server.#httpServerInstance;

    const { PORT = 3000, NODE_ENV: MODE } = process.env;

    // Create the HTTP server
    Server.#httpServerInstance = http.createServer(app);

    // Listen to the specified port
    Server.#httpServerInstance.listen(PORT, () => {
      console.log(
        'App is running in '.brightMagenta.underline.bold.italic +
          `${MODE}`.brightYellow.underline.bold.italic +
          ' mode on port '.brightMagenta.underline.bold.italic +
          `${PORT}`.brightYellow.underline.bold.italic +
          ' 🚀...'.brightMagenta.underline.bold.italic
      );
    });

    return Server.#httpServerInstance;
  }

  /**
   * Close the HTTP server
   * @returns {void}
   */
  static close() {
    if (Server.#httpServerInstance) {
      Server.#httpServerInstance.close(() => {
        console.log('HTTP server closed'.red);
      });
    }
  }
}

// Run the server if not running in test mode
if (process.env.NODE_ENV !== 'testing') {
  Server.initialize(createApp());
}

module.exports = { Server };
