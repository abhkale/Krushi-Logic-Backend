const mongoose = require('mongoose');
const { LOCATION_TYPES } = require('../utils/constants');

const userLocationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    country: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
    type: { type: String, enum: Object.values(LOCATION_TYPES), default: LOCATION_TYPES.HOME },
}, { timestamps: true });

userLocationSchema.index({ userId: 1 });
userLocationSchema.index({ pincode: 1 });
userLocationSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('UserLocation', userLocationSchema);
