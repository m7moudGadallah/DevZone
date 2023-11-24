const { AuthService } = require('../../../../../src/api/v1/services');
const { Database } = require('../../../../../src/config');
const { AppError } = require('../../../../../src/shared/helpers');

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  })),
}));

jest.mock('../../../../../src/shared/services/jwt-service.js', () => ({
  JWTService: {
    generate: jest.fn(() => 'mocked-jwt-token'),
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn((password, salt) => Promise.resolve(`hashed-${password}`)),
}));

describe('AuthService', () => {
  let mockDatabase;

  beforeAll(() => {
    mockDatabase = Database.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should throw an error for missed parameters', async () => {
      await expect(AuthService.signup).rejects.toThrow(expect.any(AppError));
    });
    it('should create a new user and return a jwt token', async () => {
      // Mock create
      const mockUser = {
        username: 'test',
        password: 'test1234',
      };

      // Mock database response
      mockDatabase.user.findUnique.mockResolvedValue(null);
      mockDatabase.user.create.mockResolvedValue({ id: 1 });

      const token = await AuthService.signup(
        mockUser.username,
        mockUser.password
      );

      expect(mockDatabase.user.findUnique).toHaveBeenCalledWith({
        where: {
          username: mockUser.username,
        },
      });

      expect(mockDatabase.user.create).toHaveBeenCalledWith({
        data: {
          username: mockUser.username,
          password: `hashed-${mockUser.password}`,
        },
      });

      expect(token).toBeDefined();
      expect(token).toMatch('mocked-jwt-token');
    });

    it('should throw error when signup with username is already exist', async () => {
      // Mock create
      const mockUser = {
        username: 'test',
        password: 'test1234',
      };

      // Mock database response
      mockDatabase.user.findUnique.mockResolvedValue({
        id: 1,
        username: mockUser.username,
      });

      await expect(
        AuthService.signup(mockUser.username, mockUser.password)
      ).rejects.toThrow(expect.any(AppError));
    });
  });
});
