const Role = require('../models/Role');
const Permission = require('../models/Permission');
const RolePermission = require('../models/RolePermission');
const UserRoles = require('../models/UserRoles');
const UserPermissions = require('../models/UserPermissions');
const logger = require('../utils/logger');

const createRole = async ({ name, description }) => {
    const existing = await Role.findOne({ name: name.toUpperCase() });
    if (existing) {
        const err = new Error('Role already exists');
        err.statusCode = 409;
        throw err;
    }
    return Role.create({ name, description });
};

const getRoles = async () => Role.find().sort({ name: 1 });

const createPermission = async ({ name, description }) => {
    const existing = await Permission.findOne({ name: name.toUpperCase() });
    if (existing) {
        const err = new Error('Permission already exists');
        err.statusCode = 409;
        throw err;
    }
    return Permission.create({ name, description });
};

const getPermissions = async () => Permission.find().sort({ name: 1 });

const assignPermissionToRole = async (roleId, permissionId) => {
    const [role, permission] = await Promise.all([Role.findById(roleId), Permission.findById(permissionId)]);
    if (!role) { const err = new Error('Role not found'); err.statusCode = 404; throw err; }
    if (!permission) { const err = new Error('Permission not found'); err.statusCode = 404; throw err; }

    const existing = await RolePermission.findOne({ roleId, permissionId });
    if (existing) {
        const err = new Error('Permission already assigned to role');
        err.statusCode = 409;
        throw err;
    }
    return RolePermission.create({ roleId, permissionId });
};

const removePermissionFromRole = async (roleId, permissionId) => {
    const result = await RolePermission.findOneAndDelete({ roleId, permissionId });
    if (!result) {
        const err = new Error('Role-Permission mapping not found');
        err.statusCode = 404;
        throw err;
    }
    return result;
};

const assignRoleToUser = async (userId, roleId) => {
    const role = await Role.findById(roleId);
    if (!role) { const err = new Error('Role not found'); err.statusCode = 404; throw err; }

    const existing = await UserRoles.findOne({ userId, roleId });
    if (existing) {
        const err = new Error('Role already assigned to user');
        err.statusCode = 409;
        throw err;
    }
    return UserRoles.create({ userId, roleId });
};

const removeRoleFromUser = async (userId, roleId) => {
    const result = await UserRoles.findOneAndDelete({ userId, roleId });
    if (!result) {
        const err = new Error('User-Role mapping not found');
        err.statusCode = 404;
        throw err;
    }
    return result;
};

const assignPermissionToUser = async (userId, permissionId, type) => {
    return UserPermissions.findOneAndUpdate(
        { userId, permissionId },
        { type },
        { upsert: true, new: true }
    );
};

const getUserPermissions = async (userId) => {
    const [userRoles, directPermissions] = await Promise.all([
        UserRoles.find({ userId }).populate('roleId'),
        UserPermissions.find({ userId }).populate('permissionId'),
    ]);

    const roleIds = userRoles.map((ur) => ur.roleId?._id).filter(Boolean);
    const rolePermissions = await RolePermission.find({ roleId: { $in: roleIds } }).populate('permissionId');

    const granted = new Set();
    const denied = new Set();

    rolePermissions.forEach((rp) => {
        if (rp.permissionId) granted.add(rp.permissionId.name);
    });

    directPermissions.forEach((up) => {
        if (up.permissionId) {
            if (up.type === 'GRANT') granted.add(up.permissionId.name);
            else denied.add(up.permissionId.name);
        }
    });

    denied.forEach((p) => granted.delete(p));
    return { roles: userRoles.map((ur) => ur.roleId), permissions: Array.from(granted) };
};

const hasPermission = async (userId, permissionName) => {
    const { permissions } = await getUserPermissions(userId);
    return permissions.includes(permissionName);
};

module.exports = {
    createRole, getRoles, createPermission, getPermissions,
    assignPermissionToRole, removePermissionFromRole,
    assignRoleToUser, removeRoleFromUser,
    assignPermissionToUser, getUserPermissions, hasPermission,
};
