const subscriptionService = require('../services/subscriptionService');
const { subscriptionPlanSchema, userSubscriptionSchema, paginationSchema } = require('../utils/validators');

exports.createPlan = async (req, res, next) => {
    try {
        const { error, value } = subscriptionPlanSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const plan = await subscriptionService.createPlan(value);
        return res.status(201).json({ success: true, data: plan });
    } catch (err) { next(err); }
};

exports.getPlans = async (req, res, next) => {
    try {
        const plans = await subscriptionService.getPlans(req.query.status);
        return res.status(200).json({ success: true, data: plans });
    } catch (err) { next(err); }
};

exports.getPlanById = async (req, res, next) => {
    try {
        const plan = await subscriptionService.getPlanById(req.params.id);
        return res.status(200).json({ success: true, data: plan });
    } catch (err) { next(err); }
};

exports.updatePlan = async (req, res, next) => {
    try {
        const plan = await subscriptionService.updatePlan(req.params.id, req.body);
        return res.status(200).json({ success: true, data: plan });
    } catch (err) { next(err); }
};

exports.subscribe = async (req, res, next) => {
    try {
        const { error, value } = userSubscriptionSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const subscription = await subscriptionService.subscribeToPlan(req.user.userId, value.planId);
        return res.status(201).json({ success: true, data: subscription });
    } catch (err) { next(err); }
};

exports.getMySubscription = async (req, res, next) => {
    try {
        const subscription = await subscriptionService.getUserSubscription(req.user.userId);
        return res.status(200).json({ success: true, data: subscription });
    } catch (err) { next(err); }
};

exports.getSubscriptionHistory = async (req, res, next) => {
    try {
        const { error, value } = paginationSchema.validate(req.query);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const result = await subscriptionService.getUserSubscriptionHistory(req.user.userId, value);
        return res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
};
