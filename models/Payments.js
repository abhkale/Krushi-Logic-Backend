const mongoose = require('mongoose');
const { PAYMENT_STATUS, PAYMENT_MODES } = require('../utils/constants');

const paymentsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlans', required: true },
    amount: { type: Number, required: true, min: 0 },
    paymentMode: { type: String, enum: Object.values(PAYMENT_MODES), required: true },
    paymentStatus: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING },
    transactionId: { type: String, unique: true, sparse: true, trim: true },
}, { timestamps: true });

paymentsSchema.index({ userId: 1 });
paymentsSchema.index({ transactionId: 1 });
paymentsSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Payments', paymentsSchema);
