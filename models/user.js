const mongoose = require('mongoose');
const { USER_ROLES, USER_STATUS } = require('../utils/constants');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    role: {
        type: String,
        enum: Object.values(USER_ROLES),
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(USER_STATUS),
        default: USER_STATUS.PENDING,
    },
}, {
    timestamps: true, 
});

module.exports = mongoose.model('User', userSchema);