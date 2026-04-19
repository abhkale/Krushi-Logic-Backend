const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, trim: true },
}, { timestamps: true });

roleSchema.index({ name: 1 });

module.exports = mongoose.model('Role', roleSchema);
