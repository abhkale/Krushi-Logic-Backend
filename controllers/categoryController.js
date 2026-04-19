const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const { categorySchema, subCategorySchema, paginationSchema } = require('../utils/validators');
const logger = require('../utils/logger');

exports.createCategory = async (req, res, next) => {
    try {
        const { error, value } = categorySchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const category = await Category.create(value);
        logger.info(`Category created: ${category._id}`);
        return res.status(201).json({ success: true, data: category });
    } catch (err) { next(err); }
};

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        return res.status(200).json({ success: true, data: categories });
    } catch (err) { next(err); }
};

exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        return res.status(200).json({ success: true, data: category });
    } catch (err) { next(err); }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const { error, value } = categorySchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const category = await Category.findByIdAndUpdate(req.params.id, value, { new: true });
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        return res.status(200).json({ success: true, data: category });
    } catch (err) { next(err); }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        return res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (err) { next(err); }
};

exports.createSubCategory = async (req, res, next) => {
    try {
        const { error, value } = subCategorySchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const subCategory = await SubCategory.create(value);
        return res.status(201).json({ success: true, data: subCategory });
    } catch (err) { next(err); }
};

exports.getSubCategories = async (req, res, next) => {
    try {
        const filter = req.params.categoryId ? { categoryId: req.params.categoryId } : {};
        const subCategories = await SubCategory.find(filter).populate('categoryId', 'name').sort({ name: 1 });
        return res.status(200).json({ success: true, data: subCategories });
    } catch (err) { next(err); }
};
