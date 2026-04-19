const TransportRequests = require('../models/TransportRequests');
const { TRANSPORT_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');

const createRequest = async (buyerId, requestData) => {
    const request = await TransportRequests.create({ buyerId, ...requestData });
    logger.info(`Transport request created: ${request._id}`);
    return request;
};

const getRequests = async (filter = {}, { page = 1, limit = 10 } = {}) => {
    const skip = (page - 1) * limit;
    const [requests, total] = await Promise.all([
        TransportRequests.find(filter)
            .populate('buyerId', 'username phone')
            .populate('sellerId', 'username phone')
            .populate('transporterId', 'username phone')
            .populate('productId', 'title')
            .skip(skip).limit(limit).sort({ createdAt: -1 }),
        TransportRequests.countDocuments(filter),
    ]);
    return { requests, total, page, limit, pages: Math.ceil(total / limit) };
};

const getRequestById = async (requestId) => {
    const request = await TransportRequests.findById(requestId)
        .populate('buyerId', 'username phone email')
        .populate('sellerId', 'username phone email')
        .populate('transporterId', 'username phone email')
        .populate('productId', 'title price')
        .populate('sourceLocationId')
        .populate('destinationLocationId');
    if (!request) {
        const err = new Error('Transport request not found');
        err.statusCode = 404;
        throw err;
    }
    return request;
};

const updateStatus = async (requestId, userId, status) => {
    const request = await TransportRequests.findById(requestId);
    if (!request) {
        const err = new Error('Transport request not found');
        err.statusCode = 404;
        throw err;
    }

    const validTransitions = {
        [TRANSPORT_STATUS.PENDING]: [TRANSPORT_STATUS.ACCEPTED, TRANSPORT_STATUS.CANCELLED],
        [TRANSPORT_STATUS.ACCEPTED]: [TRANSPORT_STATUS.COMPLETED, TRANSPORT_STATUS.CANCELLED],
    };

    const allowed = validTransitions[request.status];
    if (!allowed || !allowed.includes(status)) {
        const err = new Error(`Cannot transition from ${request.status} to ${status}`);
        err.statusCode = 400;
        throw err;
    }

    request.status = status;
    if (status === TRANSPORT_STATUS.ACCEPTED && !request.transporterId) {
        request.transporterId = userId;
    }
    await request.save();
    logger.info(`Transport request ${requestId} updated to ${status}`);
    return request;
};

module.exports = { createRequest, getRequests, getRequestById, updateStatus };
