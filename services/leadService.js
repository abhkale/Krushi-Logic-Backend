const Leads = require('../models/Leads');
const LeadInteractions = require('../models/LeadInteractions');
const UserSubscriptions = require('../models/UserSubscriptions');
const { PAGINATION } = require('../utils/constants');
const logger = require('../utils/logger');

const createLead = async (buyerId, { sellerId, productId }) => {
    const existing = await Leads.findOne({ buyerId, sellerId, productId });
    if (existing) return existing;

    const activeSub = await UserSubscriptions.findOne({ userId: buyerId, status: 'ACTIVE', endDate: { $gt: new Date() } })
        .populate('planId');

    if (activeSub) {
        if (activeSub.leadsUsed >= activeSub.planId.leadLimit) {
            const err = new Error('Lead limit reached for your subscription plan');
            err.statusCode = 403;
            throw err;
        }
        await UserSubscriptions.findByIdAndUpdate(activeSub._id, { $inc: { leadsUsed: 1 } });
    }

    const lead = await Leads.create({ buyerId, sellerId, productId });
    logger.info(`Lead created: ${lead._id}`);
    return lead;
};

const getLeadsByBuyer = async (buyerId, { page = 1, limit = 10 } = {}) => {
    const skip = (page - 1) * limit;
    const [leads, total] = await Promise.all([
        Leads.find({ buyerId })
            .populate('sellerId', 'username phone email')
            .populate('productId', 'title price')
            .skip(skip).limit(limit).sort({ createdAt: -1 }),
        Leads.countDocuments({ buyerId }),
    ]);
    return { leads, total, page, limit, pages: Math.ceil(total / limit) };
};

const getLeadsBySeller = async (sellerId, { page = 1, limit = 10 } = {}) => {
    const skip = (page - 1) * limit;
    const [leads, total] = await Promise.all([
        Leads.find({ sellerId })
            .populate('buyerId', 'username phone email')
            .populate('productId', 'title price')
            .skip(skip).limit(limit).sort({ createdAt: -1 }),
        Leads.countDocuments({ sellerId }),
    ]);
    return { leads, total, page, limit, pages: Math.ceil(total / limit) };
};

const viewContact = async (leadId, buyerId) => {
    const lead = await Leads.findOne({ _id: leadId, buyerId });
    if (!lead) {
        const err = new Error('Lead not found');
        err.statusCode = 404;
        throw err;
    }
    if (!lead.isContactViewed) {
        lead.isContactViewed = true;
        lead.contactSharedAt = new Date();
        await lead.save();
    }
    return lead.populate('sellerId', 'username phone email');
};

const recordInteraction = async ({ leadId, type }) => {
    const lead = await Leads.findById(leadId);
    if (!lead) {
        const err = new Error('Lead not found');
        err.statusCode = 404;
        throw err;
    }
    return LeadInteractions.create({ leadId, type });
};

const getLeadInteractions = async (leadId) => {
    return LeadInteractions.find({ leadId }).sort({ createdAt: -1 });
};

module.exports = { createLead, getLeadsByBuyer, getLeadsBySeller, viewContact, recordInteraction, getLeadInteractions };
