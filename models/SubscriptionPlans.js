const mongoose = require('mongoose');
const { SUBSCRIPTION_STATUS } = require('../utils/constants');

const subscriptionPlansSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    durationDays: { type: Number, required: true, min: 1 },
    leadLimit: { type: Number, required: true, min: 0 },
    features: [{ type: String }],
    status: { type: String, enum: Object.values(SUBSCRIPTION_STATUS), default: SUBSCRIPTION_STATUS.ACTIVE },
}, { timestamps: true });

subscriptionPlansSchema.index({ status: 1 });

module.exports = mongoose.model('SubscriptionPlans', subscriptionPlansSchema);
