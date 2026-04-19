const paymentService = require('../services/paymentService');
const { paymentSchema, paginationSchema } = require('../utils/validators');

exports.createPayment = async (req, res, next) => {
    try {
        const { error, value } = paymentSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const payment = await paymentService.createPayment(req.user.userId, value);
        return res.status(201).json({ success: true, data: payment });
    } catch (err) { next(err); }
};

exports.verifyPayment = async (req, res, next) => {
    try {
        const payment = await paymentService.verifyPayment(req.params.id, req.user.userId);
        return res.status(200).json({ success: true, message: 'Payment verified', data: payment });
    } catch (err) { next(err); }
};

exports.getPaymentById = async (req, res, next) => {
    try {
        const payment = await paymentService.getPaymentById(req.params.id, req.user.userId);
        return res.status(200).json({ success: true, data: payment });
    } catch (err) { next(err); }
};

exports.getPaymentHistory = async (req, res, next) => {
    try {
        const { error, value } = paginationSchema.validate(req.query);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const result = await paymentService.getPaymentHistory(req.user.userId, value);
        return res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
};
