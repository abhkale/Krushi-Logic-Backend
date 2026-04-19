const express = require('express');
const router = express.Router();
const rbacController = require('../controllers/rbacController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.get('/roles', auth, rbacController.getRoles);
router.post('/roles', auth, authorize('ADMIN'), rbacController.createRole);
router.get('/permissions', auth, rbacController.getPermissions);
router.post('/permissions', auth, authorize('ADMIN'), rbacController.createPermission);
router.post('/roles/:roleId/permissions/:permissionId', auth, authorize('ADMIN'), rbacController.assignPermissionToRole);
router.delete('/roles/:roleId/permissions/:permissionId', auth, authorize('ADMIN'), rbacController.removePermissionFromRole);
router.post('/users/roles', auth, authorize('ADMIN'), rbacController.assignRoleToUser);
router.delete('/users/:userId/roles/:roleId', auth, authorize('ADMIN'), rbacController.removeRoleFromUser);
router.post('/users/permissions', auth, authorize('ADMIN'), rbacController.assignPermissionToUser);
router.get('/users/:userId/permissions', auth, authorize('ADMIN'), rbacController.getUserPermissions);

module.exports = router;
