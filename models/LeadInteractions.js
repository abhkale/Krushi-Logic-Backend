const mongoose = require('mongoose');
const { LEAD_INTERACTION_TYPES } = require('../utils/constants');

const leadInteractionsSchema = new mongoose.Schema({
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Leads', required: true },
    type: { type: String, enum: Object.values(LEAD_INTERACTION_TYPES), required: true },
}, { timestamps: true });

leadInteractionsSchema.index({ leadId: 1 });
leadInteractionsSchema.index({ leadId: 1, type: 1 });
leadInteractionsSchema.index({ createdAt: -1 });

module.exports = mongoose.model('LeadInteractions', leadInteractionsSchema);
