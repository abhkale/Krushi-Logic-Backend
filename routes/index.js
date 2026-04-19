const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const leadRoutes = require('./leadRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');
const paymentRoutes = require('./paymentRoutes');
const notificationRoutes = require('./notificationRoutes');
const reviewRoutes = require('./reviewRoutes');
const rbacRoutes = require('./rbacRoutes');
const transportRoutes = require('./transportRoutes');
const profileRoutes = require('./profileRoutes');
const categoryRoutes = require('./categoryRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/leads', leadRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/payments', paymentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reviews', reviewRoutes);
router.use('/rbac', rbacRoutes);
router.use('/transport', transportRoutes);
router.use('/profiles', profileRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;
