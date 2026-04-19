const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    if (statusCode === 500) {
        logger.error(`Unhandled error: ${err.stack}`);
    } else {
        logger.warn(`Request error [${statusCode}]: ${message}`);
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: Object.values(err.errors).map((e) => e.message).join(', '),
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        return res.status(409).json({ success: false, message: `${field} already exists` });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    return res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
