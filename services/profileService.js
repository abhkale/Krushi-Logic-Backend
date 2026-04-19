const SupplierProfiles = require('../models/SupplierProfiles');
const BuyerProfiles = require('../models/BuyerProfiles');
const FarmerProfiles = require('../models/FarmerProfiles');
const TransporterProfiles = require('../models/TransporterProfiles');
const logger = require('../utils/logger');

const profileModels = {
    SUPPLIER: SupplierProfiles,
    BUYER: BuyerProfiles,
    FARMER: FarmerProfiles,
    TRANSPORTER: TransporterProfiles,
};

const getModel = (role) => {
    const Model = profileModels[role];
    if (!Model) {
        const err = new Error(`No profile type for role: ${role}`);
        err.statusCode = 400;
        throw err;
    }
    return Model;
};

const createProfile = async (userId, role, profileData) => {
    const Model = getModel(role);
    const existing = await Model.findOne({ userId });
    if (existing) {
        const err = new Error('Profile already exists');
        err.statusCode = 409;
        throw err;
    }
    const profile = await Model.create({ userId, ...profileData });
    logger.info(`Profile created for user: ${userId}, role: ${role}`);
    return profile;
};

const getProfile = async (userId, role) => {
    const Model = getModel(role);
    const profile = await Model.findOne({ userId }).populate('userId', 'username email phone');
    if (!profile) {
        const err = new Error('Profile not found');
        err.statusCode = 404;
        throw err;
    }
    return profile;
};

const updateProfile = async (userId, role, updateData) => {
    const Model = getModel(role);
    const profile = await Model.findOneAndUpdate({ userId }, updateData, { new: true, runValidators: true });
    if (!profile) {
        const err = new Error('Profile not found');
        err.statusCode = 404;
        throw err;
    }
    logger.info(`Profile updated for user: ${userId}`);
    return profile;
};

module.exports = { createProfile, getProfile, updateProfile };
