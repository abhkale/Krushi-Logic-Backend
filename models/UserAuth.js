const mongoose = require('mongoose');

const userAuthSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    passwordHash: { type: String, required: true },
    lastLoginAt: { type: Date },
    failedAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    phoneOtp: { type: String },
    emailOtp: { type: String },
    otpExpiresAt: { type: Date },
    refreshToken: { type: String },
}, { timestamps: true });

userAuthSchema.index({ userId: 1 });

module.exports = mongoose.model('UserAuth', userAuthSchema);
