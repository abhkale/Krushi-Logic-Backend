const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
}, { timestamps: true });

subCategorySchema.index({ categoryId: 1 });
subCategorySchema.index({ categoryId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('SubCategory', subCategorySchema);
