const SubscriptionPlans = require('../models/SubscriptionPlans');
const UserSubscriptions = require('../models/UserSubscriptions');
const logger = require('../utils/logger');

const createPlan = async (planData) => {
    return SubscriptionPlans.create(planData);
};

const getPlans = async (status = 'ACTIVE') => {
    const filter = status ? { status } : {};
    return SubscriptionPlans.find(filter).sort({ price: 1 });
};

const getPlanById = async (planId) => {
    const plan = await SubscriptionPlans.findById(planId);
    if (!plan) {
        const err = new Error('Plan not found');
        err.statusCode = 404;
        throw err;
    }
    return plan;
};

const updatePlan = async (planId, updateData) => {
    const plan = await SubscriptionPlans.findByIdAndUpdate(planId, updateData, { new: true, runValidators: true });
    if (!plan) {
        const err = new Error('Plan not found');
        err.statusCode = 404;
        throw err;
    }
    return plan;
};

const subscribeToPlan = async (userId, planId) => {
    const plan = await getPlanById(planId);
    if (plan.status !== 'ACTIVE') {
        const err = new Error('Plan is not active');
        err.statusCode = 400;
        throw err;
    }

    await UserSubscriptions.updateMany(
        { userId, status: 'ACTIVE' },
        { status: 'CANCELLED' }
    );

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

    const subscription = await UserSubscriptions.create({
        userId, planId, startDate, endDate, status: 'ACTIVE',
    });
    logger.info(`User ${userId} subscribed to plan ${planId}`);
    return subscription.populate('planId');
};

const getUserSubscription = async (userId) => {
    return UserSubscriptions.findOne({ userId, status: 'ACTIVE', endDate: { $gt: new Date() } })
        .populate('planId');
};

const getUserSubscriptionHistory = async (userId, { page = 1, limit = 10 } = {}) => {
    const skip = (page - 1) * limit;
    const [subs, total] = await Promise.all([
        UserSubscriptions.find({ userId }).populate('planId').skip(skip).limit(limit).sort({ createdAt: -1 }),
        UserSubscriptions.countDocuments({ userId }),
    ]);
    return { subscriptions: subs, total, page, limit };
};

module.exports = { createPlan, getPlans, getPlanById, updatePlan, subscribeToPlan, getUserSubscription, getUserSubscriptionHistory };
