const { Router } = require('express');
const { AuthMiddleware } = require('../middlewares');
const { AuthController } = require('../controllers');

const router = Router();

// TODO: Mount validation middleware

// Public routes
router.route('/signup').post(AuthController.signup);
router.route('/login').post(AuthController.login);

// Private routes
router.use(AuthMiddleware.authenticate);

router.route('/me').get(AuthController.getMe).patch(AuthController.updateMe);

router.route('/change-my-password').patch(AuthController.changeMyPassword);

module.exports = { authRoutes: router };
