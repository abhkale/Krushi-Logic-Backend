const mongoose = require('mongoose');
const { VERIFICATION_STATUS } = require('../utils/constants');

const supplierProfilesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, required: true, trim: true },
    estNumber: { type: String, trim: true },
    licenseNumber: { type: String, trim: true },
    verificationStatus: { type: String, enum: Object.values(VERIFICATION_STATUS), default: VERIFICATION_STATUS.PENDING },
    rating: { type: Number, min: 0, max: 5, default: 0 },
}, { timestamps: true });

supplierProfilesSchema.index({ userId: 1 });
supplierProfilesSchema.index({ verificationStatus: 1 });

module.exports = mongoose.model('SupplierProfiles', supplierProfilesSchema);
