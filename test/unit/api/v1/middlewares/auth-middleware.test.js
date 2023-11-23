const { AuthMiddleware } = require('../../../../../src/api/v1/middlewares');
const { AuthService } = require('../../../../../src/api/v1/services');
const { AppError } = require('../../../../../src/shared/helpers');

// mockUser
const mockUser = () => ({
  id: 'b9479684-6c1a-476f-884b-2afbb59391e4',
  name: 'Test',
  email: 'test@example.com',
  username: 'test',
  password: 'test1234',
  role: 'ADMIN',
});

// mock request
const mockRequest = () => ({
  headers: {
    authorization: `Bearer token`,
  },
});

// mock response
const mockResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);

  res.json = jest.fn().mockReturnValue(res);

  return res;
};

// mock next
const mockNext = () => jest.fn();

// Mock the AuthService class
jest.mock('../../../../../src/api/v1/services/auth-service.js', () => ({
  AuthService: {
    getMeViaToken: jest.fn(),
  },
}));

describe('API/v1 - AuthMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AuthService.getMeViaToken.mockResolvedValueOnce(mockUser());
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('authenticate', () => {
    it('should call next() if there is no token', async () => {
      const req = {};
      const res = mockResponse();
      const next = mockNext();

      // Call the `authenticate` method of the `AuthMiddleware` class
      await AuthMiddleware.authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('should call next() if there is a token and set user in locals', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      // Call the `authenticate` method of the `AuthMiddleware` class
      await AuthMiddleware.authenticate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.locals).toBeDefined();
      expect(req.locals.user).toMatchObject(mockUser());
    });
  });

  describe('authorize', () => {
    it('should call next() if user role is authorized', () => {
      // Mock the request object
      const req = {
        locals: {
          user: mockUser(),
        },
      };

      // Mock the response object
      const res = mockResponse();

      // Mock the next function
      const next = mockNext();

      // Call the `authorize` method of the `AuthMiddleware` class
      AuthMiddleware.authorize('ADMIN')(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should call throw an error if user role is not authorized', () => {
      // Mock the request object
      const req = {
        locals: {
          user: mockUser(),
        },
      };

      // Mock the response object
      const res = mockResponse();

      // Mock the next function
      const next = mockNext();

      // Call the `authorize` method of the `AuthMiddleware` class
      AuthMiddleware.authorize('CLIENT')(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });
  });
});
