const express = require('express');

// middlewares
const {
  protectToken,
  vendor,
  admin,
} = require('../middlewares/usersMiddlewares');

const {
  createProductValidations,
  checkValidations,
} = require('../middlewares/validationsMiddlewares');

const { protectProductOwner } = require('../middlewares/productsMiddleware');

// controller
const {
  postProduct,
  getAllProducts,
  getProductById,
  patchProduct,
  deleteProduct,
} = require('../controllers/productsController');

const router = express.Router();

router.route('/').get(getAllProducts);

router.use(protectToken);
router.route('/').post(vendor, postProduct);
router
  .route('/:id')
  .get(vendor, getProductById)
  .patch(protectProductOwner, patchProduct)
  .delete(protectProductOwner, deleteProduct);

module.exports = { productsRouter: router };
