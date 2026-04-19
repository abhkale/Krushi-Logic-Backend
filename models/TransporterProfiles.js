const mongoose = require('mongoose');

const transporterProfilesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, trim: true },
    vehicleTypes: [{ type: String }],
    capacity: { type: Number, min: 0 },
    ratePerKm: { type: Number, min: 0 },
    availabilityStatus: { type: Boolean, default: true },
}, { timestamps: true });

transporterProfilesSchema.index({ userId: 1 });
transporterProfilesSchema.index({ availabilityStatus: 1 });

module.exports = mongoose.model('TransporterProfiles', transporterProfilesSchema);
