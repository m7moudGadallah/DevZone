const {
  AUTH_VALIDATION_SCHEMA,
} = require('../../../../../src/api/v1/validations');

// Reused variables
const username = 'test';
const password = 'test1234';

const badUsername = 'x';
const badPassword = 'test';

describe('AUTH_VALIDATION_SCHEMA', () => {
  describe('signupSchema', () => {
    it('should validate username, password', () => {
      const { error, value } = AUTH_VALIDATION_SCHEMA.signup.validate({
        username,
        password,
      });

      expect(error).toBeUndefined();
      expect(value).toMatchObject({
        username,
        password,
      });
    });

    it('should throw an error for bad username', () => {
      const { error } = AUTH_VALIDATION_SCHEMA.signup.validate({
        username: badUsername,
        password,
      });

      expect(error).toBeDefined();
      expect(error.message).toMatch(
        '"username" must be at least 3 characters long'
      );
    });

    it('should throw an error for bad password', () => {
      const { error } = AUTH_VALIDATION_SCHEMA.signup.validate({
        username,
        password: badPassword,
      });

      expect(error).toBeDefined();
      expect(error.message).toMatch(
        '"password" must be at least 8 characters long'
      );
    });

    it(`should throw an error if passwordConfirm doesn't match password`, () => {
      const { error } = AUTH_VALIDATION_SCHEMA.signup.validate({
        username,
        password,
        passwordConfirm: 'test1235',
      });

      expect(error).toBeDefined();
      expect(error.message).toMatch(`"passwordConfirm" must match "password"`);
    });

    it('should throw an error if username is missed', () => {
      const { error } = AUTH_VALIDATION_SCHEMA.signup.validate({
        password,
      });

      expect(error).toBeDefined();
      expect(error.message).toMatch('"username" is required');
    });

    it('should throw an error if password is missed', () => {
      const { error } = AUTH_VALIDATION_SCHEMA.signup.validate({
        username,
      });

      expect(error).toBeDefined();
      expect(error.message).toMatch('"password" is required');
    });

    it('should strip unknown properties', () => {
      const { error, value } = AUTH_VALIDATION_SCHEMA.signup.validate({
        username,
        password,
        x: 10,
      });

      expect(error).toBeUndefined();
      expect(value).toBeDefined();
      expect(value).not.toHaveProperty('x');
      expect(value).toMatchObject({
        username,
        password,
      });
    });
  });

  describe('loginSchema', () => {
    it('should validate username, password', () => {
      const { error, value } = AUTH_VALIDATION_SCHEMA.login.validate({
        username,
        password,
      });

      expect(error).toBeUndefined();
      expect(value).toMatchObject({
        username,
        password,
      });
    });

    it('should throw an error for bad username', () => {
      const { error } = AUTH_VALIDATION_SCHEMA.login.validate({
        username: badUsername,
        password,
      });

      expect(error).toBeDefined();
      expect(error.message).toMatch(
        '"username" must be at least 3 characters long'
      );
    });

    it('should throw an error for bad password', () => {
      const { error } = AUTH_VALIDATION_SCHEMA.login.validate({
        username,
        password: badPassword,
      });

      expect(error).toBeDefined();
      expect(error.message).toMatch(
        '"password" must be at least 8 characters long'
      );
    });

    it('should throw an error if username is missed', () => {
      const { error } = AUTH_VALIDATION_SCHEMA.login.validate({
        password,
      });

      expect(error).toBeDefined();
      expect(error.message).toMatch('"username" is required');
    });

    it('should throw an error if password is missed', () => {
      const { error } = AUTH_VALIDATION_SCHEMA.login.validate({
        username,
      });

      expect(error).toBeDefined();
      expect(error.message).toMatch('"password" is required');
    });

    it('should strip unknown properties', () => {
      const { error, value } = AUTH_VALIDATION_SCHEMA.login.validate({
        username,
        password,
        x: 10,
      });

      expect(error).toBeUndefined();
      expect(value).toBeDefined();
      expect(value).not.toHaveProperty('x');
      expect(value).toMatchObject({
        username,
        password,
      });
    });
  });

  describe('meSchema', () => {
    it('should throw an error if email is not valid', () => {
      const { error } = AUTH_VALIDATION_SCHEMA.me.validate({ email: 'test' });

      expect(error).toBeDefined();
      expect(error.message).toMatch('"email" must be a valid email');
    });

    it('should throw an error if about is exceeds 50000 characters', () => {
      const about = 'c'.repeat(500001);

      const { error } = AUTH_VALIDATION_SCHEMA.me.validate({ about });

      expect(error).toBeDefined();
      expect(error.message).toMatch(
        '"about" must be at most 50000 characters long'
      );
    });

    it('should strip unknown properties', () => {
      const email = 'test@example.com';
      const about = `I'm a test`;

      const { error, value } = AUTH_VALIDATION_SCHEMA.me.validate({
        email,
        about,
        x: 10,
      });

      expect(error).toBeUndefined();
      expect(value).toBeDefined();
      expect(value).not.toHaveProperty('x');
      expect(value).toMatchObject({
        email,
        about,
      });
    });
  });

  describe('changePasswordSchema', () => {
    it('should throw an error if password is not valid', () => {
      const { error } = AUTH_VALIDATION_SCHEMA['change-my-password'].validate({
        password: badPassword,
        newPassword: password,
      });

      expect(error).toBeDefined();
      expect(error.message).toMatch(
        '"password" must be at least 8 characters long'
      );
    });

    it('should throw an error if newPassword is not valid', () => {
      const { error } = AUTH_VALIDATION_SCHEMA['change-my-password'].validate({
        password: password,
        newPassword: badPassword,
      });

      expect(error).toBeDefined();
      expect(error.message).toMatch(
        '"newPassword" must be at least 8 characters long'
      );
    });

    it(`should throw error if newPasswordConfirm doesn't match newPassword`, () => {
      const { error } = AUTH_VALIDATION_SCHEMA['change-my-password'].validate({
        password: password,
        newPassword: password,
        newPasswordConfirm: 'test5235',
      });

      expect(error).toBeDefined();
      expect(error.message).toMatch(
        '"newPasswordConfirm" must match "newPassword"'
      );
    });

    it('should strip unknown properties', () => {
      const { error, value } = AUTH_VALIDATION_SCHEMA[
        'change-my-password'
      ].validate({
        password,
        newPassword: password,
        newPasswordConfirm: password,
        x: '10',
      });

      expect(error).toBeUndefined();
      expect(value).toBeDefined();
      expect(value).not.toHaveProperty('x');
      expect(value).toMatchObject({
        password,
        newPassword: password,
        newPasswordConfirm: password,
      });
    });
  });
});
