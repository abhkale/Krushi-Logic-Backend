const leadService = require('../services/leadService');
const { leadInteractionSchema } = require('../utils/validators');

exports.recordInteraction = async (req, res, next) => {
    try {
        const { error, value } = leadInteractionSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const interaction = await leadService.recordInteraction(value);
        return res.status(201).json({ success: true, data: interaction });
    } catch (err) { next(err); }
};

exports.getLeadInteractions = async (req, res, next) => {
    try {
        const interactions = await leadService.getLeadInteractions(req.params.leadId);
        return res.status(200).json({ success: true, data: interactions });
    } catch (err) { next(err); }
};
