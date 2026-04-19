const productService = require('../services/productService');
const { productListingSchema, paginationSchema } = require('../utils/validators');

exports.getProducts = async (req, res, next) => {
    try {
        const { error, value } = paginationSchema.validate(req.query);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const { categoryId, status, sellerId, search } = req.query;
        const result = await productService.getProducts({ ...value, categoryId, status, sellerId, search });
        return res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

exports.addProduct = async (req, res, next) => {
    try {
        const { error, value } = productListingSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const product = await productService.createProduct(req.user.userId, value);
        return res.status(201).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        return res.status(200).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const { error, value } = productListingSchema.validate(req.body, { allowUnknown: true });
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const product = await productService.updateProduct(req.params.id, req.user.userId, value);
        return res.status(200).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await productService.deleteProduct(req.params.id, req.user.userId);
        return res.status(200).json({ success: true, message: 'Product deactivated', data: product });
    } catch (err) {
        next(err);
    }
};
