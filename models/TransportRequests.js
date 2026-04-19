const mongoose = require('mongoose');
const { TRANSPORT_STATUS } = require('../utils/constants');

const transportRequestsSchema = new mongoose.Schema({
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductListing', required: true },
    transporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sourceLocationId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserLocation', required: true },
    destinationLocationId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserLocation', required: true },
    expectedPrice: { type: Number, min: 0 },
    status: { type: String, enum: Object.values(TRANSPORT_STATUS), default: TRANSPORT_STATUS.PENDING },
}, { timestamps: true });

transportRequestsSchema.index({ buyerId: 1, status: 1 });
transportRequestsSchema.index({ transporterId: 1, status: 1 });
transportRequestsSchema.index({ status: 1 });

module.exports = mongoose.model('TransportRequests', transportRequestsSchema);
