const bcrypt = require('bcryptjs');
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
  compare: jest.fn((password, hash) => password === hash),
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

  describe('login', () => {
    it('should throw an error for missing parameters', async () => {
      await expect(AuthService.login()).rejects.toThrow(expect.any(AppError));
    });

    it('should throw an error if user is not exist', async () => {
      // Mock database response
      mockDatabase.user.findUnique.mockResolvedValue(null);

      await expect(AuthService.login('test', 'test1234')).rejects.toThrow(
        expect.any(AppError)
      );
    });

    it('should throw an error if password is not correct', async () => {
      // Mock database response
      mockDatabase.user.findUnique.mockResolvedValue({
        id: '1',
        username: 'test',
        password: 'test1345',
      });

      await expect(AuthService.login('test', 'test1234')).rejects.toThrow(
        expect.any(AppError)
      );

      expect(bcrypt.compare).toHaveBeenCalledWith('test1234', 'test1345');
      expect(bcrypt.compare).toHaveReturnedWith(false);
    });

    it('should logged user in and return jwt token', async () => {
      const mockUser = {
        id: '1',
        username: 'test',
        password: 'test1234',
      };

      // Mock database response
      mockDatabase.user.findUnique.mockResolvedValue(mockUser);

      const token = await AuthService.login(
        mockUser.username,
        mockUser.password
      );

      expect(token).toBe('mocked-jwt-token');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockUser.password,
        mockUser.password
      );
    });
  });
});
