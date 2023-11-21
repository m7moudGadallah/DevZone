/**
 * A helper function that wraps a request handler and catches any errors that it throws
 *
 * @param {function(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction): Promise<any>} fn request handler to wrap
 * @returns {import("express").RequestHandler} A request handler that wraps the given request handler and catches any errors that it throws
 */
function catchAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
}

module.exports = { catchAsync };
