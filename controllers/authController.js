const authService = require('../services/authService');
const { registerSchema, loginSchema } = require('../utils/validators');

exports.register = async (req, res, next) => {
    try {
        const { error, value } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const result = await authService.register(value);
        return res.status(201).json({ success: true, message: 'User registered successfully', data: result });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const result = await authService.login(value);
        return res.status(200).json({ success: true, message: 'Login successful', data: result });
    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res) => {
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
};
