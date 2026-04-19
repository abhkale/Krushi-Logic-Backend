const mongoose = require('mongoose');

const leadsSchema = new mongoose.Schema({
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductListing', required: true },
    isContactViewed: { type: Boolean, default: false },
    contactSharedAt: { type: Date },
}, { timestamps: true });

leadsSchema.index({ buyerId: 1 });
leadsSchema.index({ sellerId: 1 });
leadsSchema.index({ productId: 1 });
leadsSchema.index({ buyerId: 1, sellerId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('Leads', leadsSchema);
