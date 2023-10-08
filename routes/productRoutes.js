const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const authentication = require('../middlewares/jwt');

router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);
router.get('/pages', productController.getProductPages);
router.post('/', authentication.authenticateJWT, productController.addProduct);
router.put('/:id', authentication.authenticateJWT, productController.updateProduct);
router.delete('/:id', authentication.authenticateJWT, productController.deleteProduct);

module.exports = router;
