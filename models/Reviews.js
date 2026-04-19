const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductListing' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000 },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

reviewsSchema.index({ reviewedUserId: 1 });
reviewsSchema.index({ productId: 1 });
reviewsSchema.index({ reviewerId: 1 });

module.exports = mongoose.model('Reviews', reviewsSchema);
