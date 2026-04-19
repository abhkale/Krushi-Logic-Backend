const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, trim: true },
}, { timestamps: true });

permissionSchema.index({ name: 1 });

module.exports = mongoose.model('Permission', permissionSchema);
