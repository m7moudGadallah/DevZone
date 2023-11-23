const {
  AppError,
  HTTP_STATUS_CODES,
} = require('../../../../src/shared/helpers');

describe('AppError class', () => {
  it('should create an instance from AppError', () => {
    const error = new AppError();

    expect(error).toBeInstanceOf(AppError);
  });

  it('should have the correct properties with default values', () => {
    const error = new AppError();

    expect(error.message).toMatch('Something went wrong');
    expect(error.statusCode).toBe(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    expect(error.status).toBe('error');
    expect(error.isOperational).toBeTruthy();
  });

  it('should have the correct properties, when arguments are passed to constructor', () => {
    const error = new AppError(
      'Some missing fields!',
      HTTP_STATUS_CODES.BAD_REQUEST
    );

    expect(error.message).toBe('Some missing fields!');
    expect(error.statusCode).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBeTruthy();
  });

  it('should capture the stack trace', () => {
    const error = new AppError();

    expect(error.stack).toBeDefined();
  });
});
