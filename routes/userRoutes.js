const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.get('/', auth, authorize('ADMIN'), userController.listUsers);
router.get('/locations', auth, userController.getLocations);
router.post('/locations', auth, userController.addLocation);
router.get('/:id', auth, userController.getUser);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, authorize('ADMIN'), userController.deleteUser);

module.exports = router;
