const transportService = require('../services/transportService');
const { transportRequestSchema, transportStatusSchema, paginationSchema } = require('../utils/validators');

exports.createRequest = async (req, res, next) => {
    try {
        const { error, value } = transportRequestSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const request = await transportService.createRequest(req.user.userId, value);
        return res.status(201).json({ success: true, data: request });
    } catch (err) { next(err); }
};

exports.getRequests = async (req, res, next) => {
    try {
        const { error, value } = paginationSchema.validate(req.query);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.user.role === 'BUYER') filter.buyerId = req.user.userId;
        else if (req.user.role === 'TRANSPORTER') filter.transporterId = req.user.userId;

        const result = await transportService.getRequests(filter, value);
        return res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
};

exports.getRequestById = async (req, res, next) => {
    try {
        const request = await transportService.getRequestById(req.params.id);
        return res.status(200).json({ success: true, data: request });
    } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { error, value } = transportStatusSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const request = await transportService.updateStatus(req.params.id, req.user.userId, value.status);
        return res.status(200).json({ success: true, data: request });
    } catch (err) { next(err); }
};
