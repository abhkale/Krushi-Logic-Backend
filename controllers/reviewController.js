const Reviews = require('../models/Reviews');
const { reviewSchema, paginationSchema } = require('../utils/validators');
const logger = require('../utils/logger');

exports.createReview = async (req, res, next) => {
    try {
        const { error, value } = reviewSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const review = await Reviews.create({ reviewerId: req.user.userId, ...value });
        logger.info(`Review created: ${review._id}`);
        return res.status(201).json({ success: true, data: review });
    } catch (err) { next(err); }
};

exports.getProductReviews = async (req, res, next) => {
    try {
        const { error, value } = paginationSchema.validate(req.query);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const skip = (value.page - 1) * value.limit;
        const filter = { productId: req.params.productId };
        const [reviews, total] = await Promise.all([
            Reviews.find(filter).populate('reviewerId', 'username').skip(skip).limit(value.limit).sort({ createdAt: -1 }),
            Reviews.countDocuments(filter),
        ]);
        const avgRating = total > 0
            ? (await Reviews.aggregate([{ $match: filter }, { $group: { _id: null, avg: { $avg: '$rating' } } }]))[0]?.avg
            : 0;

        return res.status(200).json({ success: true, data: { reviews, total, avgRating, ...value } });
    } catch (err) { next(err); }
};

exports.getUserReviews = async (req, res, next) => {
    try {
        const { error, value } = paginationSchema.validate(req.query);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const skip = (value.page - 1) * value.limit;
        const filter = { reviewedUserId: req.params.userId };
        const [reviews, total] = await Promise.all([
            Reviews.find(filter).populate('reviewerId', 'username').skip(skip).limit(value.limit).sort({ createdAt: -1 }),
            Reviews.countDocuments(filter),
        ]);
        return res.status(200).json({ success: true, data: { reviews, total, ...value } });
    } catch (err) { next(err); }
};

exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Reviews.findOneAndDelete({ _id: req.params.id, reviewerId: req.user.userId });
        if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
        return res.status(200).json({ success: true, message: 'Review deleted' });
    } catch (err) { next(err); }
};
