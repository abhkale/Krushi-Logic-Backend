const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.post('/', auth, paymentController.createPayment);
router.put('/:id/verify', auth, paymentController.verifyPayment);
router.get('/:id', auth, paymentController.getPaymentById);
router.get('/', auth, paymentController.getPaymentHistory);

module.exports = router;
