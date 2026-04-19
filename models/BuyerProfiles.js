const mongoose = require('mongoose');

const buyerProfilesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, trim: true },
    businessType: { type: String, trim: true },
}, { timestamps: true });

buyerProfilesSchema.index({ userId: 1 });

module.exports = mongoose.model('BuyerProfiles', buyerProfilesSchema);
