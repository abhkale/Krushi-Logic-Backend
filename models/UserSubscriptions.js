const mongoose = require('mongoose');
const { SUBSCRIPTION_STATUS } = require('../utils/constants');

const userSubscriptionsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlans', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: Object.values(SUBSCRIPTION_STATUS), default: SUBSCRIPTION_STATUS.ACTIVE },
    leadsUsed: { type: Number, default: 0 },
}, { timestamps: true });

userSubscriptionsSchema.index({ userId: 1, status: 1 });
userSubscriptionsSchema.index({ endDate: 1 });

module.exports = mongoose.model('UserSubscriptions', userSubscriptionsSchema);
