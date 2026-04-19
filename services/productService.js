const ProductListing = require('../models/product');
const ProductImages = require('../models/ProductImages');
const { PAGINATION, PRODUCT_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');

const createProduct = async (sellerId, productData) => {
    const product = await ProductListing.create({ sellerId, ...productData });
    logger.info(`Product created: ${product._id} by seller: ${sellerId}`);
    return product;
};

const getProducts = async ({ page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, categoryId, status, sellerId, search } = {}) => {
    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    if (status) filter.status = status;
    else filter.status = PRODUCT_STATUS.ACTIVE;
    if (sellerId) filter.sellerId = sellerId;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
        ProductListing.find(filter)
            .populate('categoryId', 'name')
            .populate('subCategoryId', 'name')
            .skip(skip).limit(limit).sort({ createdAt: -1 }),
        ProductListing.countDocuments(filter),
    ]);
    return { products, total, page, limit, pages: Math.ceil(total / limit) };
};

const getProductById = async (productId) => {
    const product = await ProductListing.findById(productId)
        .populate('categoryId', 'name')
        .populate('subCategoryId', 'name')
        .populate('sellerId', 'username email phone');
    if (!product) {
        const err = new Error('Product not found');
        err.statusCode = 404;
        throw err;
    }
    const images = await ProductImages.find({ productListingId: productId });
    return { ...product.toObject(), images };
};

const updateProduct = async (productId, sellerId, updateData) => {
    const product = await ProductListing.findOneAndUpdate(
        { _id: productId, sellerId },
        updateData,
        { new: true, runValidators: true }
    );
    if (!product) {
        const err = new Error('Product not found or unauthorized');
        err.statusCode = 404;
        throw err;
    }
    logger.info(`Product updated: ${productId}`);
    return product;
};

const deleteProduct = async (productId, sellerId) => {
    const product = await ProductListing.findOneAndUpdate(
        { _id: productId, sellerId },
        { status: PRODUCT_STATUS.INACTIVE },
        { new: true }
    );
    if (!product) {
        const err = new Error('Product not found or unauthorized');
        err.statusCode = 404;
        throw err;
    }
    logger.info(`Product deactivated: ${productId}`);
    return product;
};

const addProductImage = async (productListingId, imageUrl, isPrimary = false) => {
    if (isPrimary) {
        await ProductImages.updateMany({ productListingId }, { isPrimary: false });
    }
    return ProductImages.create({ productListingId, imageUrl, isPrimary });
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct, addProductImage };
