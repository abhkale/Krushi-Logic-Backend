const profileService = require('../services/profileService');
const {
    supplierProfileSchema, buyerProfileSchema, farmerProfileSchema, transporterProfileSchema,
} = require('../utils/validators');

const schemaMap = {
    SUPPLIER: supplierProfileSchema,
    BUYER: buyerProfileSchema,
    FARMER: farmerProfileSchema,
    TRANSPORTER: transporterProfileSchema,
};

exports.createProfile = async (req, res, next) => {
    try {
        const role = req.user.role;
        const schema = schemaMap[role];
        if (!schema) return res.status(400).json({ success: false, message: 'No profile for this role' });

        const { error, value } = schema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const profile = await profileService.createProfile(req.user.userId, role, value);
        return res.status(201).json({ success: true, data: profile });
    } catch (err) { next(err); }
};

exports.getMyProfile = async (req, res, next) => {
    try {
        const profile = await profileService.getProfile(req.user.userId, req.user.role);
        return res.status(200).json({ success: true, data: profile });
    } catch (err) { next(err); }
};

exports.getProfileByUserId = async (req, res, next) => {
    try {
        const { userId, role } = req.params;
        const profile = await profileService.getProfile(userId, role.toUpperCase());
        return res.status(200).json({ success: true, data: profile });
    } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const role = req.user.role;
        const profile = await profileService.updateProfile(req.user.userId, role, req.body);
        return res.status(200).json({ success: true, data: profile });
    } catch (err) { next(err); }
};
