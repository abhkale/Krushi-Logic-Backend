const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const leadInteractionController = require('../controllers/leadInteractionController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.post('/', auth, authorize('BUYER', 'ADMIN'), leadController.createLead);
router.get('/buyer', auth, authorize('BUYER', 'ADMIN'), leadController.getMyLeads);
router.get('/seller', auth, authorize('SUPPLIER', 'FARMER', 'ADMIN'), leadController.getSellerLeads);
router.get('/:id/contact', auth, authorize('BUYER', 'ADMIN'), leadController.viewContact);

router.post('/interactions', auth, leadInteractionController.recordInteraction);
router.get('/:leadId/interactions', auth, leadInteractionController.getLeadInteractions);

module.exports = router;
