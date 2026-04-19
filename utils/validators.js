const Joi = require('joi');
const { USER_ROLES, LOCATION_TYPES, PERMISSION_TYPES, LEAD_INTERACTION_TYPES,
    SUBSCRIPTION_STATUS, PAYMENT_STATUS, PAYMENT_MODES, NOTIFICATION_TYPES,
    TRANSPORT_STATUS } = require('./constants');

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    password: Joi.string().min(6).max(128).required(),
    role: Joi.string().valid(...Object.values(USER_ROLES)).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
    password: Joi.string().required(),
}).or('email', 'phone');

const updateUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
});

const locationSchema = Joi.object({
    country: Joi.string().required(),
    state: Joi.string().required(),
    district: Joi.string().required(),
    city: Joi.string().required(),
    pincode: Joi.string().pattern(/^[0-9]{6}$/).required(),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    type: Joi.string().valid(...Object.values(LOCATION_TYPES)).default('HOME'),
});

const productListingSchema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(2000),
    categoryId: Joi.string().required(),
    subCategoryId: Joi.string(),
    productMasterId: Joi.string(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().min(0).required(),
    unit: Joi.string().required(),
    locationId: Joi.string(),
    expiresAt: Joi.date().greater('now'),
});

const leadSchema = Joi.object({
    sellerId: Joi.string().required(),
    productId: Joi.string().required(),
});

const leadInteractionSchema = Joi.object({
    leadId: Joi.string().required(),
    type: Joi.string().valid(...Object.values(LEAD_INTERACTION_TYPES)).required(),
});

const subscriptionPlanSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    durationDays: Joi.number().integer().min(1).required(),
    leadLimit: Joi.number().integer().min(0).required(),
    features: Joi.array().items(Joi.string()),
    status: Joi.string().valid(...Object.values(SUBSCRIPTION_STATUS)).default('ACTIVE'),
});

const userSubscriptionSchema = Joi.object({
    planId: Joi.string().required(),
});

const paymentSchema = Joi.object({
    planId: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    paymentMode: Joi.string().valid(...Object.values(PAYMENT_MODES)).required(),
    transactionId: Joi.string(),
});

const notificationSchema = Joi.object({
    userId: Joi.string().required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
    type: Joi.string().valid(...Object.values(NOTIFICATION_TYPES)).required(),
});

const reviewSchema = Joi.object({
    reviewedUserId: Joi.string(),
    productId: Joi.string(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(1000),
});

const transportRequestSchema = Joi.object({
    sellerId: Joi.string().required(),
    productId: Joi.string().required(),
    transporterId: Joi.string(),
    sourceLocationId: Joi.string().required(),
    destinationLocationId: Joi.string().required(),
    expectedPrice: Joi.number().min(0),
});

const transportStatusSchema = Joi.object({
    status: Joi.string().valid(...Object.values(TRANSPORT_STATUS)).required(),
});

const roleSchema = Joi.object({
    name: Joi.string().uppercase().required(),
    description: Joi.string(),
});

const permissionSchema = Joi.object({
    name: Joi.string().uppercase().required(),
    description: Joi.string(),
});

const assignRoleSchema = Joi.object({
    userId: Joi.string().required(),
    roleId: Joi.string().required(),
});

const assignPermissionSchema = Joi.object({
    userId: Joi.string().required(),
    permissionId: Joi.string().required(),
    type: Joi.string().valid(...Object.values(PERMISSION_TYPES)).required(),
});

const supplierProfileSchema = Joi.object({
    businessName: Joi.string().required(),
    estNumber: Joi.string(),
    licenseNumber: Joi.string(),
});

const buyerProfileSchema = Joi.object({
    companyName: Joi.string(),
    businessType: Joi.string(),
});

const farmerProfileSchema = Joi.object({
    farmSize: Joi.number().min(0),
    cropTypes: Joi.array().items(Joi.string()),
    organicCertified: Joi.boolean().default(false),
});

const transporterProfileSchema = Joi.object({
    companyName: Joi.string(),
    vehicleTypes: Joi.array().items(Joi.string()),
    capacity: Joi.number().min(0),
    ratePerKm: Joi.number().min(0),
    availabilityStatus: Joi.boolean().default(true),
});

const categorySchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
});

const subCategorySchema = Joi.object({
    categoryId: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string(),
});

const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
});

module.exports = {
    registerSchema,
    loginSchema,
    updateUserSchema,
    locationSchema,
    productListingSchema,
    leadSchema,
    leadInteractionSchema,
    subscriptionPlanSchema,
    userSubscriptionSchema,
    paymentSchema,
    notificationSchema,
    reviewSchema,
    transportRequestSchema,
    transportStatusSchema,
    roleSchema,
    permissionSchema,
    assignRoleSchema,
    assignPermissionSchema,
    supplierProfileSchema,
    buyerProfileSchema,
    farmerProfileSchema,
    transporterProfileSchema,
    categorySchema,
    subCategorySchema,
    paginationSchema,
};
