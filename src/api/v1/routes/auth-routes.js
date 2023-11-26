const { Router } = require('express');
const { validate, AuthMiddleware } = require('../middlewares');
const { AuthController } = require('../controllers');

const router = Router();

// Mount validation middleware
router.use(validate('AUTH'));

// Public routes
router.route('/signup').post(AuthController.signup);
router.route('/login').post(AuthController.login);

// Private routes
router.use(AuthMiddleware.authenticate);

router.route('/me').get(AuthController.getMe).patch(AuthController.updateMe);

router.route('/change-my-password').patch(AuthController.changeMyPassword);

router.route('/logout').get(AuthController.logout);

module.exports = { authRoutes: router };
