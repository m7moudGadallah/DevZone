const { catchAsync } = require('../../../../src/shared/helpers');

describe('catchAsync', () => {
  // Mock req, res, next
  const req = {};
  const res = {};
  const next = jest.fn();

  beforeEach(() => {
    next.mockClear();
  });
  it('should return middleware function', () => {
    const middleware = catchAsync(() => {});

    expect(typeof middleware).toBe('function');
  });

  it('should catch and pass errors to the next middleware', async () => {
    const error = new Error('Something went wrong!');

    const fn = async () => {
      throw error;
    };

    const middleware = catchAsync(fn);

    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
