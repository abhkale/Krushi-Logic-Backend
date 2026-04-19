const mongoose = require('mongoose');

const productImagesSchema = new mongoose.Schema({
    productListingId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductListing', required: true },
    imageUrl: { type: String, required: true, trim: true },
    isPrimary: { type: Boolean, default: false },
}, { timestamps: true });

productImagesSchema.index({ productListingId: 1 });
productImagesSchema.index({ productListingId: 1, isPrimary: 1 });

module.exports = mongoose.model('ProductImages', productImagesSchema);
