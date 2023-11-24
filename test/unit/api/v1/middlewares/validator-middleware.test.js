const { validate } = require('../../../../../src/api/v1/middlewares');
const { AppError } = require('../../../../../src/shared/helpers');

const mockRequest = () => ({
  path: '/auth/signup',
});

const mockResponse = () => ({
  status: jest.fn().mockReturnValue(this),
  json: jest.fn().mockReturnValue(this),
});

const mockNext = () => jest.fn();

describe('validate', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
  });
  it('should throw an error if no validation schema is provided', () => {
    expect(() => validate()).toThrow(expect.any(AppError));
  });

  it('should throw an error for invalid validation schema', () => {
    expect(() => validate()).toThrow(expect.any(AppError));
  });

  it('should return a middleware function', () => {
    expect(typeof validate('AUTH')).toBe('function');
  });

  it('should return a middleware function that calls next if no schema is found for the endpoint', async () => {
    req.path = '/x';

    const middleware = validate('AUTH');
    await expect(middleware(req, res, next)).toBeUndefined();

    expect(next).toHaveBeenCalledWith();
  });

  it('should return a middleware function that call the next if the request body is valid', async () => {
    req.body = {
      username: 'test',
      password: 'test1234',
    };

    const middleware = validate('AUTH');
    await expect(middleware(req, res, next)).toBeUndefined();

    expect(next).toHaveBeenCalledWith();
  });

  it('should return a middleware function that calls next with an error if the request body is invalid', async () => {
    req.body = {
      username: 'x',
      password: 'test13',
    };

    const middleware = validate('AUTH');

    await expect(middleware(req, res, next)).toBeUndefined();

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });
});
