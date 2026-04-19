const notificationService = require('../services/notificationService');
const { notificationSchema, paginationSchema } = require('../utils/validators');

exports.createNotification = async (req, res, next) => {
    try {
        const { error, value } = notificationSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const notification = await notificationService.createNotification(value);
        return res.status(201).json({ success: true, data: notification });
    } catch (err) { next(err); }
};

exports.getNotifications = async (req, res, next) => {
    try {
        const { error, value } = paginationSchema.validate(req.query);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const unreadOnly = req.query.unreadOnly === 'true';
        const result = await notificationService.getNotifications(req.user.userId, { ...value, unreadOnly });
        return res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
};

exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await notificationService.markAsRead(req.params.id, req.user.userId);
        return res.status(200).json({ success: true, data: notification });
    } catch (err) { next(err); }
};

exports.markAllAsRead = async (req, res, next) => {
    try {
        const result = await notificationService.markAllAsRead(req.user.userId);
        return res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
};

exports.deleteNotification = async (req, res, next) => {
    try {
        await notificationService.deleteNotification(req.params.id, req.user.userId);
        return res.status(200).json({ success: true, message: 'Notification deleted' });
    } catch (err) { next(err); }
};
