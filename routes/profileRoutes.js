const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

router.post('/', auth, profileController.createProfile);
router.get('/', auth, profileController.getMyProfile);
router.put('/', auth, profileController.updateProfile);
router.get('/:userId/:role', profileController.getProfileByUserId);

module.exports = router;
