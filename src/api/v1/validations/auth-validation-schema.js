const joi = require('joi');

// Custom error messages
const customErrorMessages = {
  'string.base': 'Invalid type, {{#label}} must be a string',
  'string.empty': 'Please enter your {{#label}}',
  'string.min': '{{#label}} must be at least {{#limit}} characters long',
  'string.max': '{{#label}} must be at most {{#limit}} characters long',
  'any.required': '{{#label}} is required',
  'any.ref': '{{#label}} must match {{#ref}}',
};

// email validation
const validateEmail = (required = true) => {
  if (required) {
    return joi.string().required().email().messages(customErrorMessages);
  }

  return joi.string().email().messages(customErrorMessages);
};

// password validation
const validatePassword = (required = true, minLength = 8, maxLength = 32) => {
  if (required) {
    return joi
      .string()
      .required()
      .min(minLength)
      .max(maxLength)
      .messages(customErrorMessages);
  }

  return joi
    .string()
    .min(minLength)
    .max(maxLength)
    .messages(customErrorMessages);
};

// username validation
const validateUsername = (required = true, minLength = 3, maxLength = 100) => {
  if (required) {
    return joi
      .string()
      .required()
      .min(minLength)
      .max(maxLength)
      .messages(customErrorMessages);
  }

  return joi
    .string()
    .min(minLength)
    .max(maxLength)
    .messages(customErrorMessages);
};

// Signup validation schema
const signupSchema = joi
  .object({
    username: validateUsername(),
    password: validatePassword(),
    passwordConfirm: joi
      .string()
      .valid(joi.ref('password'))
      .messages({
        ...customErrorMessages,
        'any.only': '"passwordConfirm" must match "password"',
      }),
  })
  .prefs({ abortEarly: false, stripUnknown: true });

// Login validation schema
const loginSchema = joi
  .object({
    username: validateUsername(),
    password: validatePassword(),
  })
  .prefs({ abortEarly: false, stripUnknown: true });

const meSchema = joi
  .object({
    email: validateEmail(false),
    about: joi.string().min(0).max(50000).message(customErrorMessages),
  })
  .prefs({ abortEarly: false, stripUnknown: true });

/**
 * @typedef AUTH_VALIDATION_SCHEMA
 * @property {signupSchema} signup
 */
const AUTH_VALIDATION_SCHEMA = Object.freeze({
  signup: signupSchema,
  login: loginSchema,
  me: meSchema,
});

module.exports = { AUTH_VALIDATION_SCHEMA };
