const {
  notImplementedControllerResponse,
} = require('../../../../src/shared/helpers');

const mockRequest = () => ({
  path: '/api/',
});

const mockResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);

  res.json = jest.fn().mockReturnValue(res);

  return res;
};

describe('notImplementedControllerResponse', () => {
  it('should send response for not implemented routes', () => {
    const req = mockRequest();
    const res = mockResponse();

    notImplementedControllerResponse(req, res);
    expect(res.status).toHaveBeenCalledWith(501);
    expect(res.json).toHaveBeenCalled();
  });
});
