const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.get('/', productController.getProducts);
router.post('/', auth, authorize('SUPPLIER', 'FARMER', 'ADMIN'), productController.addProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', auth, authorize('SUPPLIER', 'FARMER', 'ADMIN'), productController.updateProduct);
router.delete('/:id', auth, authorize('SUPPLIER', 'FARMER', 'ADMIN'), productController.deleteProduct);

module.exports = router;
