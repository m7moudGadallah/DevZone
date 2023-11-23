const { globalErrorHandler } = require('../../../../src/shared/error-handlers');
const {
  AppError,
  HTTP_STATUS_CODES,
} = require('../../../../src/shared/helpers');

const mockRequest = () => {};
const mockResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};
const mockNext = () => jest.fn();

describe('globalErrorHandler', () => {
  // Save original environment
  const originalEnv = process.env.NODE_ENV;

  const req = mockRequest();
  const res = mockResponse();
  const next = mockNext();

  beforeEach(() => {
    process.env = { ...originalEnv };
    res.json.mockClear();
    res.status.mockClear();
    next.mockClear();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should send error response in development environment', () => {
    process.env.NODE_ENV = 'development';

    // Create error object
    const error = new Error('Test Error');
    error.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;

    // Call globalErrorHandler
    globalErrorHandler(error, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something went wrong!',
      error: {
        status: error.status,
        message: error.message,
      },
    });
  });

  it('should by default to send error response to development environment when NODE_ENV is not set', () => {
    process.env = undefined;

    // create an error object
    const error = new Error('Test error');
    error.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;

    // Call globalErrorHandler
    globalErrorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(error.statusCode);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something went wrong!',
      error: {
        status: error.status,
        message: error.message,
      },
    });
  });

  it('should send error response in production environment for operational errors', () => {
    process.env.NODE_ENV = 'production';
    const error = new AppError('Test error', HTTP_STATUS_CODES.BAD_REQUEST);

    // Call globalErrorHandler
    globalErrorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something went wrong!',
      error: {
        status: error.status,
        message: error.message,
      },
    });
  });

  it('should send error response in production environment for non-operational errors', () => {
    process.env.NODE_ENV = 'production';
    const error = new Error('Internal server error');
    error.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

    // Call globalErrorHandler
    globalErrorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
    );
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something went wrong!',
      error: {
        status: 'error',
        message: 'Something went very wrong!',
      },
    });
  });
});
