const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.get('/plans', subscriptionController.getPlans);
router.get('/plans/:id', subscriptionController.getPlanById);
router.post('/plans', auth, authorize('ADMIN'), subscriptionController.createPlan);
router.put('/plans/:id', auth, authorize('ADMIN'), subscriptionController.updatePlan);
router.post('/subscribe', auth, subscriptionController.subscribe);
router.get('/my', auth, subscriptionController.getMySubscription);
router.get('/history', auth, subscriptionController.getSubscriptionHistory);

module.exports = router;
