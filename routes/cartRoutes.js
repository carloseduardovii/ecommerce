const express = require('express');

// middlewares
const {
  protectToken,
  protectAccountOwner,
} = require('../middlewares/usersMiddlewares');

// controller
const {
  getAllCarts,
  postProductToCart,
  patchProductToCart,
  postPurchaseCart,
  deleteProductFromCart,
} = require('../controllers/ordersController');

const router = express.Router();

router.use(protectToken);

router.route('/product-cart').get(getAllCarts);

router.route('/add-product').post(postProductToCart);

router.route('/update-cart').patch(patchProductToCart);

router.route('/purchase').post(postPurchaseCart);

router.route('/:productId').delete(deleteProductFromCart);

module.exports = { cartRouter: router };
