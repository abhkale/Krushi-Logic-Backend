const rbacService = require('../services/rbacService');

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        if (roles.length > 0 && !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Insufficient permissions' });
        }
        next();
    };
};

const requirePermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Authentication required' });
            }
            if (req.user.role === 'ADMIN') return next();

            const hasPermission = await rbacService.hasPermission(req.user.userId, permissionName);
            if (!hasPermission) {
                return res.status(403).json({ success: false, message: `Missing permission: ${permissionName}` });
            }
            next();
        } catch (err) {
            next(err);
        }
    };
};

module.exports = { authorize, requirePermission };
