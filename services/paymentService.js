const Payments = require('../models/Payments');
const subscriptionService = require('./subscriptionService');
const logger = require('../utils/logger');

const createPayment = async (userId, { planId, amount, paymentMode, transactionId }) => {
    const plan = await subscriptionService.getPlanById(planId);

    if (Math.abs(plan.price - amount) > 0.01) {
        const err = new Error('Payment amount does not match plan price');
        err.statusCode = 400;
        throw err;
    }

    const payment = await Payments.create({
        userId, planId, amount, paymentMode,
        transactionId: transactionId || undefined,
        paymentStatus: 'PENDING',
    });
    logger.info(`Payment created: ${payment._id}`);
    return payment;
};

const verifyPayment = async (paymentId, userId) => {
    const payment = await Payments.findOne({ _id: paymentId, userId });
    if (!payment) {
        const err = new Error('Payment not found');
        err.statusCode = 404;
        throw err;
    }
    if (payment.paymentStatus !== 'PENDING') {
        const err = new Error('Payment already processed');
        err.statusCode = 400;
        throw err;
    }

    payment.paymentStatus = 'SUCCESS';
    await payment.save();

    await subscriptionService.subscribeToPlan(userId, payment.planId.toString());
    logger.info(`Payment verified: ${paymentId}`);
    return payment;
};

const getPaymentById = async (paymentId, userId) => {
    const payment = await Payments.findOne({ _id: paymentId, userId }).populate('planId', 'name price');
    if (!payment) {
        const err = new Error('Payment not found');
        err.statusCode = 404;
        throw err;
    }
    return payment;
};

const getPaymentHistory = async (userId, { page = 1, limit = 10 } = {}) => {
    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
        Payments.find({ userId }).populate('planId', 'name price').skip(skip).limit(limit).sort({ createdAt: -1 }),
        Payments.countDocuments({ userId }),
    ]);
    return { payments, total, page, limit };
};

module.exports = { createPayment, verifyPayment, getPaymentById, getPaymentHistory };
