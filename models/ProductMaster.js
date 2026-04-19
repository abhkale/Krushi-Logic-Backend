const mongoose = require('mongoose');

const productMasterSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
    hsCode: { type: String, unique: true, sparse: true, trim: true },
    description: { type: String, trim: true },
}, { timestamps: true });

productMasterSchema.index({ categoryId: 1 });
productMasterSchema.index({ subCategoryId: 1 });
productMasterSchema.index({ hsCode: 1 });
productMasterSchema.index({ name: 'text' });

module.exports = mongoose.model('ProductMaster', productMasterSchema);
