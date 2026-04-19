const mongoose = require('mongoose');
const { USER_STATUS, USER_ROLES } = require('../utils/constants');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    status: { type: String, enum: Object.values(USER_STATUS), default: USER_STATUS.ACTIVE },
    role: { type: String, enum: Object.values(USER_ROLES), required: true },
    profileId: { type: mongoose.Schema.Types.ObjectId, refPath: 'role' },
}, { timestamps: true });

UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ role: 1, status: 1 });

module.exports = mongoose.model('User', UserSchema);
