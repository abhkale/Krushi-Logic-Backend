const User = require('../models/User');
const UserLocation = require('../models/UserLocation');
const { PAGINATION } = require('../utils/constants');
const logger = require('../utils/logger');

const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-__v');
    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }
    return user;
};

const updateUser = async (userId, updateData) => {
    const allowedFields = ['username', 'email', 'phone'];
    const filtered = {};
    allowedFields.forEach((f) => { if (updateData[f] !== undefined) filtered[f] = updateData[f]; });

    const user = await User.findByIdAndUpdate(userId, filtered, { new: true, runValidators: true }).select('-__v');
    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }
    logger.info(`User updated: ${userId}`);
    return user;
};

const listUsers = async ({ page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, role, status } = {}) => {
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        User.find(filter).select('-__v').skip(skip).limit(limit).sort({ createdAt: -1 }),
        User.countDocuments(filter),
    ]);
    return { users, total, page, limit, pages: Math.ceil(total / limit) };
};

const addLocation = async (userId, locationData) => {
    const location = await UserLocation.create({ userId, ...locationData });
    logger.info(`Location added for user: ${userId}`);
    return location;
};

const getLocations = async (userId) => {
    return UserLocation.find({ userId });
};

const deleteUser = async (userId) => {
    const user = await User.findByIdAndUpdate(userId, { status: 'SUSPENDED' }, { new: true });
    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }
    logger.info(`User suspended: ${userId}`);
    return user;
};

module.exports = { getUserById, updateUser, listUsers, addLocation, getLocations, deleteUser };
