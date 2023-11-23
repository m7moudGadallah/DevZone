const { Router } = require('express');
const { authRoutes } = require('./auth-routes');

const router = Router();

// Mount routes in parent router
router.use('/auth', authRoutes);

module.exports = { V1Router: router };
