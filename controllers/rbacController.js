const rbacService = require('../services/rbacService');
const { roleSchema, permissionSchema, assignRoleSchema, assignPermissionSchema } = require('../utils/validators');

exports.createRole = async (req, res, next) => {
    try {
        const { error, value } = roleSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const role = await rbacService.createRole(value);
        return res.status(201).json({ success: true, data: role });
    } catch (err) { next(err); }
};

exports.getRoles = async (req, res, next) => {
    try {
        const roles = await rbacService.getRoles();
        return res.status(200).json({ success: true, data: roles });
    } catch (err) { next(err); }
};

exports.createPermission = async (req, res, next) => {
    try {
        const { error, value } = permissionSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const permission = await rbacService.createPermission(value);
        return res.status(201).json({ success: true, data: permission });
    } catch (err) { next(err); }
};

exports.getPermissions = async (req, res, next) => {
    try {
        const permissions = await rbacService.getPermissions();
        return res.status(200).json({ success: true, data: permissions });
    } catch (err) { next(err); }
};

exports.assignPermissionToRole = async (req, res, next) => {
    try {
        const { roleId, permissionId } = req.params;
        const result = await rbacService.assignPermissionToRole(roleId, permissionId);
        return res.status(201).json({ success: true, data: result });
    } catch (err) { next(err); }
};

exports.removePermissionFromRole = async (req, res, next) => {
    try {
        const { roleId, permissionId } = req.params;
        await rbacService.removePermissionFromRole(roleId, permissionId);
        return res.status(200).json({ success: true, message: 'Permission removed from role' });
    } catch (err) { next(err); }
};

exports.assignRoleToUser = async (req, res, next) => {
    try {
        const { error, value } = assignRoleSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const result = await rbacService.assignRoleToUser(value.userId, value.roleId);
        return res.status(201).json({ success: true, data: result });
    } catch (err) { next(err); }
};

exports.removeRoleFromUser = async (req, res, next) => {
    try {
        const { userId, roleId } = req.params;
        await rbacService.removeRoleFromUser(userId, roleId);
        return res.status(200).json({ success: true, message: 'Role removed from user' });
    } catch (err) { next(err); }
};

exports.assignPermissionToUser = async (req, res, next) => {
    try {
        const { error, value } = assignPermissionSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });
        const result = await rbacService.assignPermissionToUser(value.userId, value.permissionId, value.type);
        return res.status(201).json({ success: true, data: result });
    } catch (err) { next(err); }
};

exports.getUserPermissions = async (req, res, next) => {
    try {
        const result = await rbacService.getUserPermissions(req.params.userId);
        return res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
};
