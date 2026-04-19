const mongoose = require('mongoose');

const farmerProfilesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    farmSize: { type: Number, min: 0 },
    cropTypes: [{ type: String }],
    organicCertified: { type: Boolean, default: false },
}, { timestamps: true });

farmerProfilesSchema.index({ userId: 1 });

module.exports = mongoose.model('FarmerProfiles', farmerProfilesSchema);
