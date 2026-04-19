const leadService = require('../services/leadService');
const { leadSchema, paginationSchema } = require('../utils/validators');

exports.createLead = async (req, res, next) => {
    try {
        const { error, value } = leadSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const lead = await leadService.createLead(req.user.userId, value);
        return res.status(201).json({ success: true, data: lead });
    } catch (err) { next(err); }
};

exports.getMyLeads = async (req, res, next) => {
    try {
        const { error, value } = paginationSchema.validate(req.query);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const result = await leadService.getLeadsByBuyer(req.user.userId, value);
        return res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
};

exports.getSellerLeads = async (req, res, next) => {
    try {
        const { error, value } = paginationSchema.validate(req.query);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const result = await leadService.getLeadsBySeller(req.user.userId, value);
        return res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
};

exports.viewContact = async (req, res, next) => {
    try {
        const lead = await leadService.viewContact(req.params.id, req.user.userId);
        return res.status(200).json({ success: true, data: lead });
    } catch (err) { next(err); }
};
