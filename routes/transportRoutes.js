const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');
const auth = require('../middleware/auth');

router.post('/requests', auth, transportController.createRequest);
router.get('/requests', auth, transportController.getRequests);
router.get('/requests/:id', auth, transportController.getRequestById);
router.put('/requests/:id/status', auth, transportController.updateStatus);

module.exports = router;
