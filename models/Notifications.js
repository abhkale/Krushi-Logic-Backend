const mongoose = require('mongoose');
const { NOTIFICATION_TYPES } = require('../utils/constants');

const notificationsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: Object.values(NOTIFICATION_TYPES), required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

notificationsSchema.index({ userId: 1, isRead: 1 });
notificationsSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notifications', notificationsSchema);
