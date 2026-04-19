const mongoose = require('mongoose');
const { PERMISSION_TYPES } = require('../utils/constants');

const userPermissionsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    permissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Permission', required: true },
    type: { type: String, enum: Object.values(PERMISSION_TYPES), required: true },
}, { timestamps: true });

userPermissionsSchema.index({ userId: 1, permissionId: 1 }, { unique: true });

module.exports = mongoose.model('UserPermissions', userPermissionsSchema);
