const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserAuth = require('../models/UserAuth');
const { JWT } = require('../utils/constants');
const logger = require('../utils/logger');

const register = async ({ username, email, phone, password, role }) => {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
        const field = existingUser.email === email ? 'email' : 'phone';
        const err = new Error(`User with this ${field} already exists`);
        err.statusCode = 409;
        throw err;
    }

    const user = await User.create({ username, email, phone, role });
    const passwordHash = await bcrypt.hash(password, 12);
    await UserAuth.create({ userId: user._id, passwordHash });

    const token = generateToken(user._id, user.role);
    logger.info(`New user registered: ${user._id}`);
    return { user: sanitizeUser(user), token };
};

const login = async ({ email, phone, password }) => {
    const query = email ? { email } : { phone };
    const user = await User.findOne(query);
    if (!user) {
        const err = new Error('Invalid credentials');
        err.statusCode = 401;
        throw err;
    }

    const auth = await UserAuth.findOne({ userId: user._id });
    if (!auth) {
        const err = new Error('Account not configured');
        err.statusCode = 500;
        throw err;
    }

    if (auth.lockedUntil && auth.lockedUntil > new Date()) {
        const err = new Error('Account locked. Try again later.');
        err.statusCode = 423;
        throw err;
    }

    const isMatch = await bcrypt.compare(password, auth.passwordHash);
    if (!isMatch) {
        await UserAuth.findByIdAndUpdate(auth._id, {
            $inc: { failedAttempts: 1 },
            ...(auth.failedAttempts >= 4 ? { lockedUntil: new Date(Date.now() + 15 * 60 * 1000) } : {}),
        });
        const err = new Error('Invalid credentials');
        err.statusCode = 401;
        throw err;
    }

    await UserAuth.findByIdAndUpdate(auth._id, {
        failedAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
    });

    if (user.status !== 'ACTIVE') {
        const err = new Error('Account is not active');
        err.statusCode = 403;
        throw err;
    }

    const token = generateToken(user._id, user.role);
    logger.info(`User logged in: ${user._id}`);
    return { user: sanitizeUser(user), token };
};

const generateToken = (userId, role) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return jwt.sign(
        { userId: userId.toString(), role },
        secret,
        { expiresIn: JWT.EXPIRES_IN }
    );
};

const sanitizeUser = (user) => {
    const obj = user.toObject();
    delete obj.__v;
    return obj;
};

module.exports = { register, login, generateToken };
