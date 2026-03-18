const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductsDebugCount,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview
} = require('../controllers/productController');

router.get('/debug/count', getProductsDebugCount);
router.route('/').get(getProducts).post(createProduct);
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);
router.post('/:id/reviews', addProductReview);

module.exports = router;