const { JsonResponseGenerator } = require('../../../../src/shared/helpers');

describe('JsonResponseGenerator', () => {
  describe('generateCookieOptions', () => {
    it('should generate cookie options with default secure option', () => {
      const cookieOptions = JsonResponseGenerator.generateCookieOptions(30000);

      expect(cookieOptions).toBeDefined();
      expect(cookieOptions).toHaveProperty('expires');
      expect(cookieOptions).toHaveProperty('httpOnly');
      expect(cookieOptions).toHaveProperty('secure');
      expect(cookieOptions.secure).toBeFalsy();
    });

    it('should generate cookie options', () => {
      const cookieOptions = JsonResponseGenerator.generateCookieOptions(
        30000,
        true
      );

      expect(cookieOptions).toBeDefined();
      expect(cookieOptions).toHaveProperty('expires');
      expect(cookieOptions).toHaveProperty('httpOnly');
      expect(cookieOptions).toHaveProperty('secure');
      expect(cookieOptions.secure).toBeTruthy();
    });
  });

  describe('generateSuccessResponse', () => {
    it('should generate success json response without payload', () => {
      const response =
        JsonResponseGenerator.generateSuccessResponse('success response');

      expect(response).toBeDefined();
      expect(response).toMatchObject({
        success: true,
        message: 'success response',
      });
    });

    it('should generate success json response contains token', () => {
      const token = 'test token';

      const response = JsonResponseGenerator.generateSuccessResponse(
        'success response',
        {
          token,
        }
      );

      expect(response).toBeDefined();
      expect(response).toMatchObject({
        success: true,
        message: 'success response',
        payload: {
          token,
        },
      });
    });

    it('should generate success json response contains otp', () => {
      const otp = '123456';

      const response = JsonResponseGenerator.generateSuccessResponse(
        'success response',
        {
          otp,
        }
      );

      expect(response).toBeDefined();
      expect(response).toMatchObject({
        success: true,
        message: 'success response',
        payload: {
          otp,
        },
      });
    });

    it('should generate success json response contains data', () => {
      const data = {
        item: {
          id: 1,
        },
      };

      const response = JsonResponseGenerator.generateSuccessResponse(
        'success response',
        { data }
      );

      expect(response).toBeDefined();
      expect(response).toMatchObject({
        success: true,
        message: 'success response',
        payload: { data },
      });
    });

    it('should generate success json response contains data with count and pagination', () => {
      const data = {
        items: [{ id: 3 }, { id: 4 }],
        count: 2,
        pagination: {
          next: {
            page: 3,
            pageSize: 1,
          },
          prev: {
            page: 1,
            pageSize: 2,
          },
        },
      };

      const response = JsonResponseGenerator.generateSuccessResponse(
        'success response',
        { data }
      );

      expect(response).toBeDefined();
      expect(response).toMatchObject({
        success: true,
        message: 'success response',
        payload: {
          data,
        },
      });
    });
  });

  describe('generateErrorResponse', () => {
    it('should generate error response', () => {
      const error = {
        message: 'something went wrong',
        status: 'error',
      };

      const response = JsonResponseGenerator.generateErrorResponse(error);

      expect(response).toBeDefined();
      expect(response).toMatchObject({
        success: false,
        message: 'Something went wrong!',
        error,
      });
    });
  });
});
