const userService = require('../services/userService');
const { updateUserSchema, locationSchema, paginationSchema } = require('../utils/validators');

exports.getUser = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        return res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { error, value } = updateUserSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const userId = req.params.id;
        if (req.user.userId !== userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        const user = await userService.updateUser(userId, value);
        return res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

exports.listUsers = async (req, res, next) => {
    try {
        const { error, value } = paginationSchema.validate(req.query);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const { role, status } = req.query;
        const result = await userService.listUsers({ ...value, role, status });
        return res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

exports.addLocation = async (req, res, next) => {
    try {
        const { error, value } = locationSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const location = await userService.addLocation(req.user.userId, value);
        return res.status(201).json({ success: true, data: location });
    } catch (err) {
        next(err);
    }
};

exports.getLocations = async (req, res, next) => {
    try {
        const locations = await userService.getLocations(req.user.userId);
        return res.status(200).json({ success: true, data: locations });
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        return res.status(200).json({ success: true, message: 'User suspended', data: user });
    } catch (err) {
        next(err);
    }
};
