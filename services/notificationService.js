const Notifications = require('../models/Notifications');
const logger = require('../utils/logger');

const createNotification = async ({ userId, title, message, type }) => {
    const notification = await Notifications.create({ userId, title, message, type });
    logger.info(`Notification created for user: ${userId}`);
    return notification;
};

const getNotifications = async (userId, { page = 1, limit = 10, unreadOnly = false } = {}) => {
    const filter = { userId };
    if (unreadOnly) filter.isRead = false;

    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
        Notifications.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
        Notifications.countDocuments(filter),
        Notifications.countDocuments({ userId, isRead: false }),
    ]);
    return { notifications, total, unreadCount, page, limit };
};

const markAsRead = async (notificationId, userId) => {
    const notification = await Notifications.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
    );
    if (!notification) {
        const err = new Error('Notification not found');
        err.statusCode = 404;
        throw err;
    }
    return notification;
};

const markAllAsRead = async (userId) => {
    const result = await Notifications.updateMany({ userId, isRead: false }, { isRead: true });
    return { modifiedCount: result.modifiedCount };
};

const deleteNotification = async (notificationId, userId) => {
    const notification = await Notifications.findOneAndDelete({ _id: notificationId, userId });
    if (!notification) {
        const err = new Error('Notification not found');
        err.statusCode = 404;
        throw err;
    }
    return notification;
};

module.exports = { createNotification, getNotifications, markAsRead, markAllAsRead, deleteNotification };
