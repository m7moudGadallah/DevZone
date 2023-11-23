require('../../../../src/config');
const { JWTService } = require('../../../../src/shared/services');

describe('JWTService', () => {
  const id = 'b9479684-6c1a-476f-884b-2afbb59391e4';

  it('should generate a JWT token', () => {
    const token = JWTService.generate(id);
    expect(token).toBeDefined();
  });

  it('should decode a valid JWT token', () => {
    const token = JWTService.generate(id);
    const decodedToken = JWTService.decode(token);

    expect(decodedToken).toBeDefined();
    expect(decodedToken).toHaveProperty('iat');
    expect(decodedToken).toHaveProperty('exp');
    expect(decodedToken).toHaveProperty('id');
    expect(decodedToken.id).toBe(id);
    expect(decodedToken.iat).toBeDefined();
    expect(decodedToken.exp).toBeDefined();
  });
});
