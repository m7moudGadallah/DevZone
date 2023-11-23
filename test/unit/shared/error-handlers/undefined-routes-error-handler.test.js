const {
  undefinedRoutesErrorHandler,
} = require('../../../../src/shared/error-handlers');

const { AppError } = require('../../../../src/shared/helpers');

describe('undefinedRoutesErrorHandler', () => {
  // Mock req, res, next
  const req = {
    originalUrl: '/api',
  };
  const res = {};
  const next = jest.fn();

  it('should call next middleware', () => {
    undefinedRoutesErrorHandler(req, res, next);
    const error = next.mock.calls[0][0];

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(error.statusCode).toBe(404);
    expect(error.message).toMatch("Can't find");
  });
});
