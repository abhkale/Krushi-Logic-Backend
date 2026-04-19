const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.get('/', categoryController.getCategories);
router.post('/', auth, authorize('ADMIN'), categoryController.createCategory);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', auth, authorize('ADMIN'), categoryController.updateCategory);
router.delete('/:id', auth, authorize('ADMIN'), categoryController.deleteCategory);
router.get('/:categoryId/subcategories', categoryController.getSubCategories);
router.post('/subcategories', auth, authorize('ADMIN'), categoryController.createSubCategory);

module.exports = router;
